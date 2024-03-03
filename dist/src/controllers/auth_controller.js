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
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).send("Email already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            email: email,
            password: hashedPassword
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
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
        const accessToken = jsonwebtoken_1.default.sign({
            id: user._id
        }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRES_IN
        });
        return res.status(200).send({
            accessToken: accessToken
        });
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).send("logout");
});
exports.default = {
    register,
    login,
    logout
};
//# sourceMappingURL=auth_controller.js.map