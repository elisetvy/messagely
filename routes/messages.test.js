"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");

let testUser1Token;


describe("Users Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
    let u2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });
    let m1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "u1-to-u2",
    });
    let m2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "u2-to-u1",
    });

    testUser1Token = jwt.sign({ username: u1.username }, SECRET_KEY);
  });


  describe("GET /messages/:id", function () {
    test("getting message by id", async function () {
      let response = await request(app)
        .get("/messages/1")
        .query({ _token: testUser1Token });
      expect(response.body).toEqual({ message: {
        id: 1,
        body: "u1-to-u2",
        sent_at: expect.any(String),
        read_at: null,
        from_user: {
          username: "test1",
          first_name: "Test1",
          last_name: "Testy1",
          phone: "+14155550000"
        },
        to_user: {
          username: "test2",
          first_name: "Test2",
          last_name: "Testy2",
          phone: "+14155552222"
        }}});
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .get("/messages/1")
        .query({ _token: "WRONG" });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .get("/messages/1");
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("POST /messages/", function () {
    test("getting message by id", async function () {
      let response = await request(app)
        .post("/messages/")
        .query({ _token: testUser1Token })
        .send({
          "to_username": "test2",
          "body": "test message"
        });
      expect(response.body).toEqual({ message: {
        id: expect.any(Number),
        from_username: "test1",
        to_username: "test2",
        body: "test message",
        sent_at: expect.any(String)
      }});
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .post("/messages/")
        .query({ _token: "WRONG" })
        .send({
          "to_username": "test2",
          "body": "test message"
        });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .post("/messages/")
        .send({
          "to_username": "test2",
          "body": "test message"
        });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 400 when there is no body", async function () {
      let response = await request(app)
        .post("/messages/")
        .query({ _token: testUser1Token });
      expect(response.statusCode).toEqual(400);
    });
  });
});

afterAll(async function () {
  await db.end();
});
