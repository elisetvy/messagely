"use strict";

const { SECRET_KEY } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
  if (!req.body) throw new BadRequestError();
  const { username, password } = req.body;

  if (await User.authenticate(username, password)) {
    await User.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */


router.post("/register", async function (req, res, next) {
  if (!req.body) throw new BadRequestError();

  const user = await User.register(req.body);
  const token = jwt.sign({ username: user.username }, SECRET_KEY);

  return res.json({ token });
});



module.exports = router;
