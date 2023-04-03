const request = require('supertest');
const assert = require('assert');
const mongoose = require('mongoose');
const { app } = require('./index');
let server;

beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log("Hey started!");
    })
});

afterAll(async () => {
    await server.close()
    await mongoose.connection.close();
})

describe('Post To login', () => {
    test('Fail to login due to missing fields', async () => {
        const response = await request(app).post('/auth/login').send({ email: "joe" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ errorMessage: "Please enter all required fields." });
    })

    //test('Fail to login due to no existing member', async () => {
        //const response = await request(app).post('/auth/login').send({ email: "joe", password: "joe" });
        //expect(response.status).toBe(401);
        //expect(response.body).toEqual({ errorMessage: "Wrong email or password provided." });
    //})
})

describe('Post To Register', () => {
    let server;


    test('Fail to register due to missing fields', async () => {
        const response = await request(app).post('/auth/register').send({ email: "joe" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ errorMessage: "Please enter all required fields." });
    })

    test('Fail to login due to bad password', async () => {
        const response = await request(app).post('/auth/register').send({ firstName: "joe", lastName: "mama", username: "lol", email: "test", password: "joe", passwordVerify: "joe" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ errorMessage: "Please enter a password of at least 8 characters." });
    })
})



