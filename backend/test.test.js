const request = require('supertest');
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

describe("Get To Splash", () => {
    test("Get Splash Screen", async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
    })
})

describe('Post To Register', () => {
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

    test('Proper register', async () => {
        const response = await request(app).post('/auth/register').send({ firstName: "joe", lastName: "aa", username: "lol", email: "test@gmail.com", password: "password1", passwordVerify: "password1" });
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            success: true,
            user: {
                firstName: "joe",
                lastName: "aa",
                email: "test@gmail.com"
            }
        });
    })
})

describe('Post To login', () => {
    test('Fail to login due to missing fields', async () => {
        const response = await request(app).post('/auth/login').send({ email: "joe" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ errorMessage: "Please enter all required fields." });
    })

    test('Fail to login due to no existing member', async () => {
        const response = await request(app).post('/auth/login').send({ email: "joe", password: "joe" });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ errorMessage: "Wrong email or password provided." });
    })

    test('Fail to login due to wrong password', async () => {
        const response = await request(app).post('/auth/login').send({ email: "test@gmail.com", password: "password" });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ errorMessage: "Wrong email or password provided." });
    })

    test('Successful login', async () => {
        const response = await request(app).post('/auth/login').send({ email: "test@gmail.com", password: "password1" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            user: {
                firstName: "joe",
                lastName: "aa",
                email: "test@gmail.com"
            }
        });
    })

})
