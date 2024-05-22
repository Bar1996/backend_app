import request from 'supertest';
import appInit from '../App';
import mongoose from 'mongoose';
import Post from '../models/post_model';
import { Express } from 'express';
import User from '../models/user_model';
// TODO add tests for post
const testUser = {
    email: "psottest@gmail.com",
    password: "123456",
    accessToken: null,
    name: "John",
    imgUrl: "https://www.google.com"
  }

let app: Express;
beforeAll ( async() => {
    app = await appInit();
    console.log('beforeAll');
    await Post.deleteMany();
    await User.deleteMany({email: testUser.email});
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post('/auth/login').send(testUser);
    testUser.accessToken = res.body.accessToken;
});

afterAll ( async () => {    
    console.log('afterAll');
    mongoose.connection.close();
});




describe('Post', () => {
    test('GET /post - empty collection',  async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    });

    const post = {
        title: "post title",
        message: "post message",
        owner: "Bar"
    }

    test('POST /post - empty collection',  async () => {
        const res = await request(app).post('/post')
        .set('Authorization', 'Bearer ' + testUser.accessToken)
        .send(post);
        expect(res.statusCode).toBe(201);
    });

});
