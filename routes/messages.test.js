"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");

const User = require("../models/user");
const Message = require("../models/message");

let testUserToken;

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

  testUserToken = jwt.sign({ username: u1.username})
});