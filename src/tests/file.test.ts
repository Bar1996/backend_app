import request from 'supertest';
import appInit from '../App';
import mongoose from 'mongoose';
import fs from 'mz/fs';
import {Express} from 'express';

let app: Express;
beforeAll(async () => {
    console.log('beforeAll');
    app = await appInit();
});

afterAll(async () => {
    console.log('afterAll');
    mongoose.connection.close();
});

jest.setTimeout(30000);

describe('File', () => {
    test('upload file', async () => {
        const filepath = `${__dirname}/avatar.jpg`;
        const rs = await fs.exists(filepath);
        if (rs){
            const response = await request(app).post('/file/file?file=123.jpeg').attach('file', filepath);
            expect(response.statusCode).toBe(200);
        }

  
    });
})
