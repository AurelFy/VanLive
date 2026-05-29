
"use strict";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrYwhHOXQsnseeUWuN6NGvcC7jTb_J2Bc",
  authDomain: "vanlive-49f90.firebaseapp.com",
  projectId: "vanlive-49f90",
  storageBucket: "vanlive-49f90.firebasestorage.app",
  messagingSenderId: "833757167722",
  appId: "1:833757167722:web:2952e5c39c30ea3358ca13"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginPage = document.querySelector(".login");
const registerPage = document.querySelector(".register");

const message = document.querySelector(".auth__message");

const loginEmail = document.querySelector(".auth__input--login-email");
const loginPassword = document.querySelector(".auth__input--login-password");

const registerEmail = document.querySelector(".auth__input--register-email");
const registerPassword = document.querySelector(".auth__input--register-password");
const registerFirstname = document.querySelector(".auth__input--firstname");

const loginBtn = document.querySelector(".auth__btn--login");
const registerBtn = document.querySelector(".auth__btn--register");

const toRegister = document.querySelector(".auth__switch--reg");
const toLogin = document.querySelector(".auth__switch--log");

let justRegistered = false;

function showMessage(text) {
  message.textContent = text;
}

toRegister.addEventListener("click", () => {
  loginPage.classList.add("hidden");
  registerPage.classList.remove("hidden");
});

toLogin.addEventListener("click", () => {
  registerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

registerBtn.addEventListener("click", async () => {
  try {
    justRegistered = true;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerEmail.value,
      registerPassword.value
    );

    await updateProfile(userCredential.user, {
      displayName: registerFirstname.value.trim()
    });

    await userCredential.user.reload();

    await signOut(auth);

    registerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    showMessage("Compte créé avec succès ✓");

  } catch (error) {
    justRegistered = false;
    showMessage(error.message);
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );

  } catch (error) {
    showMessage(error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && !justRegistered && window.location.pathname.includes("connexion.html")) {
    window.location.href = "index.html";
  }

  justRegistered = false;
});