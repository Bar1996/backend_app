import request from 'supertest';
import appInit from '../App';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../models/user_model';

const user = {
  email: "authtest@gmail.com",
  password: "123456",
  accessToken: null,
  name: "John2",
  imgUrl: "https://www.google.com"
};

let app: Express;
let accessToken: string = "";
let refreshToken: string = "";

beforeAll(async () => {
  app = await appInit();
  console.log('beforeAll');
  await User.deleteMany({ email: user.email });
});

afterAll(async () => {
  console.log('afterAll');
  await mongoose.connection.close();
});

describe('Auth test', () => {
  test('POST /register', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.statusCode).toBe(200);
  });

  test('POST /login', async () => {
    const data = { email: user.email, password: user.password };
    const res = await request(app).post('/auth/login').send(data);
    expect(res.statusCode).toBe(200);
    console.log(res.body);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  });

  const timeout = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  jest.setTimeout(100000);

  test("refresh token", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.statusCode).toBe(200);
    console.log(res.body);

    refreshToken = res.body.refreshToken;
    const res2 = await request(app).get("/auth/refresh")
      .set('Authorization', 'Bearer ' + refreshToken)
      .send();

    expect(res2.statusCode).toBe(200);
    accessToken = res2.body.accessToken;
    refreshToken = res2.body.refreshToken;
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  });

  test("refresh token after expiration", async () => {
    await timeout(6000);

    const res2 = await request(app).get("/auth/refresh")
      .set('Authorization', 'Bearer ' + refreshToken)
      .send();
    expect(res2.statusCode).toBe(200);
    accessToken = res2.body.accessToken;
    refreshToken = res2.body.refreshToken;

    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  });

  test("refresh token violation", async () => {
    const res = await request(app).get("/auth/refresh")
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

    const res2 = await request(app).get("/auth/refresh")
      .set('Authorization', 'Bearer ' + oldRefreshToken)
      .send();
    expect(res2.statusCode).not.toBe(200);

    const res3 = await request(app).get("/auth/refresh")
      .set('Authorization', 'Bearer ' + refreshToken)
      .send();
    expect(res3.statusCode).not.toBe(200);
  });

  test("GET /auth/logout", async () => {
    const res = await request(app).get("/auth/logout")
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.statusCode).toBe(200);

    // Verify that the user's tokens are cleared
    const userFromDb = await User.findOne({ email: user.email });
    expect(userFromDb?.tokens.length).toBe(0);
  });

  test("GET /auth/getById", async () => {
    const res = await request(app).get("/auth/getById")
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ user: user.email });
    expect(res.statusCode).toBe(200);
  });

  test("PUT /auth/update", async () => {
    const updateData = { user: user.email, name: "John Updated", imgUrl: "https://www.example.com" };
    const res = await request(app).put("/auth/update")
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("John Updated");
  });

  test("PUT /auth/updatePassword", async () => {
    const updatePasswordData = { user: user.email, oldPassword: user.password, newPassword: "newpassword123" };
    const res = await request(app).put("/auth/updatePassword")
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updatePasswordData);
    expect(res.statusCode).toBe(200);
  });

  test("GET /auth/check", async () => {
    const res = await request(app).get("/auth/check")
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.statusCode).toBe(200);
  });

  test("GET /auth/:id", async () => {
    const userFromDb = await User.findOne({ email: user.email });
    const res = await request(app).get(`/auth/${userFromDb?._id}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
  });
});
