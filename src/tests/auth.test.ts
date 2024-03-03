import request from 'supertest';
import appInit from '../App';
import mongoose from 'mongoose';
import { Express } from 'express';
import User from '../models/user_model';

const user = {
    email: 'teszt@gmail.com',
    password: 'teszt'
}

let app: Express;
beforeAll ( async() => {
    app = await appInit();
    console.log('beforeAll');
    await User.deleteMany({email: user.email})
});

afterAll ( async () => {    
    console.log('afterAll');
    mongoose.connection.close();
});




describe('Auth test', () => {
    test('POST /register',  async () => {
        const res = await request(app).post('/auth/register').send(user);
        expect(res.statusCode).toBe(200);
    });


    test('POST /login',  async () => {
        const res = await request(app).post('/auth/login').send(user);
        expect(res.statusCode).toBe(200);
        console.log(res.body);

        const accessToken = res.body.accessToken;
        expect(accessToken).not.toBeNull();

        const res2 = await request(app).get('/student').set('Authorization', 'Bearer ' + accessToken);
        expect(res2.statusCode).toBe(200);

        const fakeToken = accessToken + 'a';
        const res3 = await request(app).get('/student').set('Authorization', 'Bearer ' + fakeToken);
        expect(res3.statusCode).not.toBe(200);
    });

});
