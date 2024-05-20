import  { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Post from "../models/post_model";

const client = new OAuth2Client();


const register = async (req: Request, res: Response) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    const name = req.body.name;

    if(email == null || password == null){
       return res.status(400).send("Missing email or password");
    }
    try {
        const user = await User.findOne({email: email});
        if(user){
            return res.status(400).send("Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            imgUrl: imgUrl,
            name: name
        });

        return res.status(200).send(newUser);
    } catch (error){
        return res.status(400).send(error.message);
    }
}

const generateTokens = (userId: string): { accessToken: string, refreshToken: string } => {
    const accessToken = jwt.sign({
        _id: userId
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN
    });

    const refreshToken = jwt.sign({
        _id: userId,
        salt: Math.random()
    }, process.env.REFRESH_TOKEN_SECRET);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const login = async (req: Request, res: Response) => {
    console.log("login");

    const email = req.body.email;
    const password = req.body.password;
    if(email == null || password == null){
       return res.status(400).send("Missing email or password");
    }
   try {
    const user = await User.findOne({email: email});
    if(user == null){
        return res.status(400).send("Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
        return res.status(400).send("Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    if (user.tokens == null){
        user.tokens = [refreshToken];
    }else {
        user.tokens.push(refreshToken);
    }
    await user.save();

    return res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Login successful"
    });

   } catch (error){
         return res.status(400).send(error.message);
   }
}  

const logout = async (req: Request, res: Response) => {
    res.status(400).send("logout");
}

const refresh = async (req: Request, res: Response) => {
    console.log("refresh");
    //extract token from http header
    const authHeader = req.headers['authorization'];
    const refreshTokenOrig = authHeader && authHeader.split(' ')[1];

    if (refreshTokenOrig == null) {
        return res.status(401).send("missing token");
    }

    //verify token
    jwt.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo: { _id: string }) => {
        if (err) {
            console.log("error here");
            return res.status(403).send("invalid token");
        }

        try {
            const user = await User.findById(userInfo._id);
            console.log(user==null, user.tokens == null, user.tokens.includes(refreshTokenOrig));
            if (user == null || user.tokens == null || !user.tokens.includes(refreshTokenOrig)) {
                if (user.tokens != null) {
                    user.tokens = [];
                    await user.save();
                }
                console.log("error here2");
                return res.status(403).send("invalid token");
            }

            //generate new access token
            console.log("generating new token");
            const { accessToken, refreshToken } = generateTokens(user._id.toString());

            //update refresh token in db
            user.tokens = user.tokens.filter(token => token != refreshTokenOrig);
            user.tokens.push(refreshToken);
            await user.save();

            //return new access token & new refresh token
            console.log("sending new token");
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    });
}

const googleSignIn = async (req: Request, res: Response) => {
    try{
        const ticket = await client.verifyIdToken({
        idToken: req.body.credentialResponse,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if(email != null){
        let user = await User.findOne({'email': email});
            if(user == null){
                user = await User.create({
                    email: email,
                    imgUrl: payload?.picture,
                    name: payload?.name
                });
            }
            const { accessToken, refreshToken } = generateTokens(user._id.toString());
            if (user.tokens == null){
                user.tokens = [refreshToken];
            }else {
                user.tokens.push(refreshToken);
            }
            await user.save();

            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
                email: email,
                _id: user._id,
                imgUrl: user.imgUrl,
                message: "Login successful",
            });
        }

    }catch (error){
        return res.status(400).send(error.message);
    }
   
    
}


const getUserById = async (req: Request, res: Response) => {
    console.log("enter get user by id",req.body.user);
        try{
            const item = await User.findById(req.body.user);
            console.log("item",item.name);
            if(!item){
                res.status(404).send("not found");
            }
            else{
                res.status(200).send(item);  
            }   
        }catch (error){
            console.log(error);
            res.status(400).send(error.message);
        }
    }

    const editUser = async (req: Request, res: Response) => {
        try {
          const user = await User.findById(req.body.user);
          if (!user) {
            return res.status(404).send("not found");
          }
          user.name = req.body.name;
          user.imgUrl = req.body.imgUrl;
          // Do not update email here, ensure it's not inadvertently changed
          await user.save();
          return res.status(200).send(user);
        } catch (error) {
          console.log(error);
          return res.status(400).send(error.message);
        }
      };

      const getUser = async (req: Request, res: Response) => {
        try {
          const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send("not found");
            }
            console.log("user",user);
            return res.status(200).send(user);
        } catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    }

    const getUserPosts = async (req: Request, res: Response) => {
        const owner = req.body.user;
        console.log("owner",owner);
        try {
           
            const posts = await Post.find({ owner: owner });
            return res.status(200).send(posts);
        } catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    }


    const changePassword = async (req: Request, res: Response) => {
        try {
            const user = req.body.user;
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            if (oldPassword == null || newPassword == null) {
                return res.status(400).send("Missing old password or new password");
            }
            const userObj = await User.findById(user);
            if (userObj == null) {
                return res.status(404).send("not found");
            }
            const valid = await bcrypt.compare(oldPassword, userObj.password);
            if (!valid) {
                return res.status(400).send("Invalid old password");
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            userObj.password = hashedPassword;
            await userObj.save();
            return res.status(200).send(userObj);

        } catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    }

    const CheckAuth = async (req: Request, res: Response) => {
        console.log("Checking token validity"); // Check if this gets printed
        res.status(200).json({
            message: "Authenticated",
        });
    }
    
      


export default {
    register,
    login,
    logout,
    refresh,
    googleSignIn,
    getUserById,
    editUser,
    getUser,
    getUserPosts,
    changePassword,
    CheckAuth
}



