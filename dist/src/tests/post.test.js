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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const testUser = {
    email: "posttest@gmail.com",
    password: "123456",
    accessToken: null,
    name: "John",
    imgUrl: "https://www.google.com"
};
let app;
let postId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, App_1.default)();
    console.log('beforeAll');
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post('/auth/login').send(testUser);
    testUser.accessToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    mongoose_1.default.connection.close();
}));
describe('Post', () => {
    test('GET /post - empty collection', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/post')
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    const post = {
        text: "post message",
        owner: null,
        imgUrl: "https://www.example.com",
        timestamp: new Date().toISOString()
    };
    test('POST /post/post - create post', () => __awaiter(void 0, void 0, void 0, function* () {
        post.owner = (yield user_model_1.default.findOne({ email: testUser.email }))._id;
        const res = yield (0, supertest_1.default)(app).post('/post/post')
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(post);
        expect(res.statusCode).toBe(201);
        postId = res.body._id;
        expect(res.body.text).toBe(post.text);
    }));
    test('GET /post - with one post', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/post')
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data.length).toBe(1);
        expect(data[0].text).toBe(post.text);
    }));
    test('GET /post/:id - get post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/post/${postId}`)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.text).toBe(post.text);
    }));
    test('PUT /post/:id - update post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = { text: "updated message", imgUrl: "https://www.updated.com" };
        const res = yield (0, supertest_1.default)(app).put(`/post/${postId}`)
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(updatedPost);
        expect(res.statusCode).toBe(200);
        expect(res.body.text).toBe(updatedPost.text);
    }));
    test('DELETE /post/:id - delete post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/post/${postId}`)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const resCheck = yield (0, supertest_1.default)(app).get('/post')
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(resCheck.statusCode).toBe(200);
        expect(resCheck.body).toEqual([]);
    }));
});
//# sourceMappingURL=post.test.js.map