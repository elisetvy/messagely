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


  describe("GET /users", function () {
    test("getting list of users", async function () {
      let response = await request(app)
        .get("/users")
        .query({ _token: testUser1Token });
      expect(response.body).toEqual({
        users: [{
          username: "test1",
          first_name: "Test1",
          last_name: "Testy1"
        },
        {
          username: "test2",
          first_name: "Test2",
          last_name: "Testy2"
        }]
      });
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .get("/users")
        .query({ _token: "WRONG" });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .get("/users");
      expect(response.statusCode).toEqual(401);
    });
  });


  describe("GET /users/:username", function () {
    test("gets details of user", async function () {
      let response = await request(app)
        .get("/users/test1")
        .query({ _token: testUser1Token });
      expect(response.body).toEqual({
        user: {
          username: "test1",
          first_name: "Test1",
          last_name: "Testy1",
          phone: "+14155550000",
          join_at: expect.any(String),
          last_login_at: null
        }
      });
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .get("/users/test1")
        .query({ _token: "WRONG" });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .get("/users/test1");
      expect(response.statusCode).toEqual(401);
    });
  });


  describe("GET /users/:username/to", function () {
    test("get list of messages to user", async function () {
      let response = await request(app)
        .get("/users/test1/to")
        .query({ _token: testUser1Token });

      expect(response.body).toEqual({
        messages: [{
          body: "u2-to-u1",
          from_user: {
            first_name: "Test2",
            last_name: "Testy2",
            phone: "+14155552222",
            username: "test2",
          },
          id: expect.any(Number),
          read_at: null,
          sent_at: expect.any(String),
        }]
      });
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .get("/users/test1/to")
        .query({ _token: "WRONG" });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .get("/users/test1/to");
      expect(response.statusCode).toEqual(401);
    });
  });

  describe("GET /users/:username/from", function () {
    test("get list of messages from user", async function () {
      let response = await request(app)
        .get("/users/test1/from")
        .query({ _token: testUser1Token });

      expect(response.body).toEqual({
        messages: [{
          body: "u1-to-u2",
          to_user: {
            first_name: "Test2",
            last_name: "Testy2",
            phone: "+14155552222",
            username: "test2",
          },
          id: expect.any(Number),
          read_at: null,
          sent_at: expect.any(String),
        }]
      });
      expect(response.statusCode).toEqual(200);
    });

    test("returns 401 with invalid token", async function () {
      let response = await request(app)
        .get("/users/test1/from")
        .query({ _token: "WRONG" });
      expect(response.statusCode).toEqual(401);
    });

    test("returns 401 when logged out", async function () {
      let response = await request(app)
        .get("/users/test1/from");
      expect(response.statusCode).toEqual(401);
    });
  });
});

afterAll(async function () {
  await db.end();
});
