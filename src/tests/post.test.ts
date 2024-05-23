import request from 'supertest';
import appInit from '../App';
import mongoose from 'mongoose';
import Post from '../models/post_model';
import { Express } from 'express';
import User from '../models/user_model';

const testUser = {
  email: "posttest@gmail.com",
  password: "123456",
  accessToken: null,
  name: "John",
  imgUrl: "https://www.google.com"
};

let app: Express;
let postId: string;

beforeAll(async () => {
  app = await appInit();
  console.log('beforeAll');
  await Post.deleteMany();
  await User.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post('/auth/login').send(testUser);
  testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
  console.log('afterAll');
  mongoose.connection.close();
});

describe('Post', () => {
  test('GET /post - empty collection', async () => {
    const res = await request(app).get('/post')
      .set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data).toEqual([]);
  });

  const post = {
    text: "post message",
    owner: null,
    imgUrl: "https://www.example.com",
    timestamp: new Date().toISOString()
  };

  test('POST /post/post - create post', async () => {
    post.owner = (await User.findOne({ email: testUser.email }))._id;
    const res = await request(app).post('/post/post')
      .set('Authorization', 'Bearer ' + testUser.accessToken)
      .send(post);
    expect(res.statusCode).toBe(201);
    postId = res.body._id;
    expect(res.body.text).toBe(post.text);
  });

  test('GET /post - with one post', async () => {
    const res = await request(app).get('/post')
      .set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data.length).toBe(1);
    expect(data[0].text).toBe(post.text);
  });

  test('GET /post/:id - get post by ID', async () => {
    const res = await request(app).get(`/post/${postId}`)
      .set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe(post.text);
  });

  test('PUT /post/:id - update post by ID', async () => {
    const updatedPost = { text: "updated message", imgUrl: "https://www.updated.com" };
    const res = await request(app).put(`/post/${postId}`)
      .set('Authorization', 'Bearer ' + testUser.accessToken)
      .send(updatedPost);
    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe(updatedPost.text);
  });

  test('DELETE /post/:id - delete post by ID', async () => {
    const res = await request(app).delete(`/post/${postId}`)
      .set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);

    const resCheck = await request(app).get('/post')
      .set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(resCheck.statusCode).toBe(200);
    expect(resCheck.body).toEqual([]);
  });
});
