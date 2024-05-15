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
const supertest_1 = __importDefault(require("supertest"));
const App_1 = __importDefault(require("../App"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const user = {
    email: "authtest@gmail.com",
    password: "123456",
    accessToken: null,
    name: "John2",
    imgUrl: "https://www.google.com"
};
let app;
let accessToken;
let refreshToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log('beforeAll');
    yield user_model_1.default.deleteMany({ email: user.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    mongoose_1.default.connection.close();
}));
describe('Auth test', () => {
    test('POST /register', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/auth/register').send(user);
        expect(res.statusCode).toBe(200);
    }));
    test('POST /login', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { email: user.email, password: user.password };
        const res = yield (0, supertest_1.default)(app).post('/auth/login').send(data);
        expect(res.statusCode).toBe(200);
        console.log(res.body);
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        // const res2 = await request(app).get('/student').set('Authorization', 'Bearer ' + accessToken);
        // expect(res2.statusCode).toBe(200);
        // const fakeToken = accessToken + 'a';
        // const res3 = await request(app).get('/student').set('Authorization', 'Bearer ' + fakeToken);
        // expect(res3.statusCode).not.toBe(200);
    }));
    const timeout = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };
    jest.setTimeout(100000);
    test("refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(res.statusCode).toBe(200);
        console.log(res.body);
        //const accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).toBe(200);
        accessToken = res2.body.accessToken;
        refreshToken = res2.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        // const res3 = await request(app).get("/student")
        //     .set('Authorization', 'Bearer ' + accessToken);
        // expect(res3.statusCode).toBe(200);
    }));
    test("refresh token after expiration", () => __awaiter(void 0, void 0, void 0, function* () {
        //sleep 6 sec check if token is expired
        yield timeout(6000);
        // const res = await request(app).get("/student")
        //     .set('Authorization', 'Bearer ' + accessToken);
        // expect(res.statusCode).not.toBe(200);
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).toBe(200);
        accessToken = res2.body.accessToken;
        refreshToken = res2.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        // const res3 = await request(app).get("/student")
        //     .set('Authorization', 'Bearer ' + accessToken);
        // expect(res3.statusCode).toBe(200);
    }));
    test("refresh token violation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        const oldRefreshToken = refreshToken;
        if (oldRefreshToken == res.body.refreshToken) {
            console.log("refresh token is the same");
        }
        expect(res.statusCode).toBe(200);
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + oldRefreshToken)
            .send();
        expect(res2.statusCode).not.toBe(200);
        const res3 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res3.statusCode).not.toBe(200);
    }));
});
//# sourceMappingURL=auth.test.js.map