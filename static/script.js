"use strict";
// manage what user sees

async function processRegister(evt) {
  evt.preventDefault();

  const username = $("#username-input").val();
  const password = $("#password-input").val();
  const firstName = $("#first-name-input").val();
  const lastName = $("#last-name-input").val();
  const phone = $("#phone-input").val();

  const res = await fetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      phone
    }),
    headers: { "Content-Type": "application/json" }
  });

  const token = JSON.stringify(await res.json());
  localStorage.setItem("currentToken", token);
  console.log(token)
}

async function processLogin(evt) {
  evt.preventDefault();

  const username =$("#username-input").val();
  const password = $("#password-input").val();

  const res = await fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    }),
    headers: { "Content-Type": "application/json" }
  });

  const token = JSON.stringify(await res.json());
  localStorage.setItem("currentToken", token);
  console.log(token)
}

function showHome(evt) {
  evt.preventDefault();
  $("main").children().hide();

  const template = $("#home-page").html();
  const templateClone = $(template);
  $("main").append(templateClone);
}

function showRegister(evt) {
  evt.preventDefault();
  $("main").children().hide();

  const template = $("#register-page").html();
  const templateClone = $(template);
  $("main").append(templateClone);
}

function showLogin(evt) {
  evt.preventDefault();
  $("main").children().hide();

  const template = $("#login-page").html();
  const templateClone = $(template);
  $("main").append(templateClone);
}


if (!localStorage.getItem("currentToken")) {
  const template = $("#home-page").html();
  const templateClone = $(template);
  $("main").append(templateClone);
} else {
  const template = $("#messages-page").html();
  const templateClone = $(template);
  $("main").append(templateClone);
}


$("main").on("submit", "#register-form", processRegister);
$("main").on("submit", "#login-form", processLogin);
$("#home-link").on("click", showHome);
$("#register-link").on("click", showRegister);
$("#login-link").on("click", showLogin);
