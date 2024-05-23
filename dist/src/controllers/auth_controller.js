"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const post_model_1 = __importDefault(require("../models/post_model"));
const client = new google_auth_library_1.OAuth2Client();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    const name = req.body.name;
    if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).send("Missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user) {
            console.log("Email already exists");
            return res.status(400).send("Email already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            email: email,
            password: hashedPassword,
            imgUrl: imgUrl,
            name: name,
            userType: "local"
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        console.log("enter chatch", error);
        return res.status(400).send(error.message);
    }
});
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({
        _id: userId
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        _id: userId,
        salt: Math.random()
    }, process.env.REFRESH_TOKEN_SECRET);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    console.log("email", email, "password", password);
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("Invalid email or password");
        }
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(400).send("Invalid email or password");
        }
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "Login successful"
        });
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (accessToken == null) {
        return res.status(401).send("missing token");
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).send("invalid token");
        }
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            if (user == null) {
                return res.status(404).send("not found");
            }
            user.tokens = [];
            yield user.save();
            return res.status(200).send("logout successful");
        }
        catch (error) {
            return res.status(400).send(error.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("refresh");
    //extract token from http header
    const authHeader = req.headers['authorization'];
    const refreshTokenOrig = authHeader && authHeader.split(' ')[1];
    if (refreshTokenOrig == null) {
        return res.status(401).send("missing token");
    }
    //verify token
    jsonwebtoken_1.default.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log("error here");
            return res.status(403).send("invalid token");
        }
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            console.log(user == null, user.tokens == null, user.tokens.includes(refreshTokenOrig));
            if (user == null || user.tokens == null || !user.tokens.includes(refreshTokenOrig)) {
                if (user.tokens != null) {
                    user.tokens = [];
                    yield user.save();
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
            yield user.save();
            //return new access token & new refresh token
            console.log("sending new token");
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    }));
});
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credentialResponse,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ 'email': email });
            if (user == null) {
                user = yield user_model_1.default.create({
                    email: email,
                    imgUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                    name: payload === null || payload === void 0 ? void 0 : payload.name,
                    userType: "google"
                });
            }
            const { accessToken, refreshToken } = generateTokens(user._id.toString());
            if (user.tokens == null) {
                user.tokens = [refreshToken];
            }
            else {
                user.tokens.push(refreshToken);
            }
            yield user.save();
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
                email: email,
                _id: user._id,
                imgUrl: user.imgUrl,
                message: "Login successful",
            });
        }
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter get user by id", req.body.user);
    try {
        const item = yield user_model_1.default.findById(req.body.user);
        console.log("item", item.name);
        if (!item) {
            res.status(404).send("not found");
        }
        else {
            res.status(200).send(item);
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.body.user);
        if (!user) {
            return res.status(404).send("not found");
        }
        user.name = req.body.name;
        user.imgUrl = req.body.imgUrl;
        // Do not update email here, ensure it's not inadvertently changed
        yield user.save();
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).send("not found");
        }
        console.log("user", user);
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.body.user;
    console.log("owner", owner);
    try {
        const posts = yield post_model_1.default.find({ owner: owner });
        return res.status(200).send(posts);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.user;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        if (oldPassword == null || newPassword == null) {
            return res.status(400).send("Missing old password or new password");
        }
        const userObj = yield user_model_1.default.findById(user);
        if (userObj == null) {
            return res.status(404).send("not found");
        }
        const valid = yield bcrypt_1.default.compare(oldPassword, userObj.password);
        if (!valid) {
            return res.status(400).send("Invalid old password");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        userObj.password = hashedPassword;
        yield userObj.save();
        return res.status(200).send(userObj);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const CheckAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking token validity"); // Check if this gets printed
    res.status(200).json({
        message: "Authenticated",
    });
});
exports.default = {
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
};
//# sourceMappingURL=auth_controller.js.map