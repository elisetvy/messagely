"use strict";
// manage what user sees

let currentToken;

async function processSubmit(evt) {
  evt.preventDefault();
  if (evt.target) {
    processRegister();
  } else {
    processLogin();
  }
}


async function processRegister() {
  const username = document.querySelector("#username-input").value;
  const password = document.querySelector("#password-input").value;
  const firstName = document.querySelector("#first-name-input").value;
  const lastName = document.querySelector("#last-name-input").value;
  const phone = document.querySelector("#phone-input").value;

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

  currentToken = await res.json();
}

async function processLogin() {
  const username = document.querySelector("#username-input").value;
  const password = document.querySelector("#password-input").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    }),
    headers: { "Content-Type": "application/json" }
  });

  currentToken = await res.json();

}


if (!currentToken) {
  const template = document.querySelector("#register-page");
  const clone = template.content.cloneNode(true);
  document.body.appendChild(clone);
} else {
  const template = document.querySelector("#messages-page");
  const clone = template.content.cloneNode(true);
  document.body.appendChild(clone);
}



document.body.addEventListener("submit", processSubmit);
