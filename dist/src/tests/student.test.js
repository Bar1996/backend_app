// import request from 'supertest';
// import appInit from '../App';
// import mongoose from 'mongoose';
// import Student from '../models/student_model';
// import { Express } from 'express';
// import User from '../models/user_model';
// const testUser = {
//     email: "studenttest@gmail.com",
//     password: "123456",
//     accessToken: null,
//     name: "John1",
//     imgUrl: "https://www.google.com"
//   }
// let app: Express;
// beforeAll ( async() => {
//     app = await appInit();
//     console.log('beforeAll');
//     await Student.deleteMany();
//     await User.deleteMany({email: testUser.email});
//     await request(app).post("/auth/register").send(testUser);
//     const res = await request(app).post('/auth/login').send(testUser);
//     testUser.accessToken = res.body.accessToken;});
// afterAll ( async () => {    
//     console.log('afterAll');
//     mongoose.connection.close();
// });
// const students = [
//     {
//         name: 'John',
//         _id: '12345',
//         age: 20
//     },
//     {
//         name: 'Jane',
//         _id: '12346',
//         age: 21
//     }
// ];
// describe('Student', () => {
//     test('GET /student - empty collection',  async () => {
//         const res = await request(app).get('/student').set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res.statusCode).toBe(200);
//         const data = res.body;
//         expect(data).toEqual([]);
//     });
//     test('POST /student',  async () => {    
//         const res = await request(app)
//         .post('/student')
//         .send(students[0])
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res.statusCode).toBe(201);
//         expect(res.body.name).toBe(students[0].name);
//         const res2 = await request(app).get('/student')
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res2.statusCode).toBe(200);
//         const data = res2.body;
//         expect(data[0].name).toBe(students[0].name);  
//         expect(data[0]._id).toBe(students[0]._id);
//         expect(data[0].age).toBe(students[0].age);
//     });
//     test ('GET /student/:id', async () => {
//         const res = await request(app).get('/student/' + students[0]._id )
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res.statusCode).toBe(200);
//         expect(res.body.name).toBe(students[0].name);
//         expect(res.body._id).toBe(students[0]._id);
//         expect(res.body.age).toBe(students[0].age);
//     });
//     test ('fail GET /student/:id', async () => {
//         const res = await request(app).get('/student/00000' )
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res.statusCode).toBe(404);
//     });
//     test("DELETE /student/:id", async () => {
//         const res = await request(app).delete("/student/" + students[0]._id)
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res.statusCode).toBe(200);
//         const res2 = await request(app).get("/student/" + students[0]._id)
//         .set('Authorization', 'Bearer ' + testUser.accessToken);
//         expect(res2.statusCode).toBe(404);
//       });
// });
//# sourceMappingURL=student.test.js.map