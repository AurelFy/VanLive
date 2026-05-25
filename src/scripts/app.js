"use strict";

import '../styles/style.scss';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";


// onboarding

const isOnboardingPage = document.querySelector('.main__onboard') !== null;
const isConnexionPage = document.querySelector('.main__con') !== null;
const isIndexPage = document.querySelector('.main__index') !== null;

if (isOnboardingPage) {
  const lastBtn = document.querySelector('.fourth__btn');

  lastBtn.addEventListener('click', () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    window.location.href = 'connexion.html';
  });

} else if (!isConnexionPage && !isIndexPage) {
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

  if (!hasSeenOnboarding) {
    window.location.href = 'onboarding.html';
  } else {
    window.location.href = 'connexion.html';
  }
}



// slider onboarding

const onboardScreen = document.querySelectorAll(".onboard__screen");
const onboardBtn = document.querySelectorAll(".onboard__screen--btn");

let currentScreen = 0;

function updateScreens(nextIndex) {
  onboardScreen.forEach((screen, i) => {
    screen.classList.remove("active", "previous");

    if (i < nextIndex) {
      screen.classList.add("previous");
    } else if (i === nextIndex) {
      screen.classList.add("active");
    }
  });
}

updateScreens(currentScreen);

onboardBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentScreen < onboardScreen.length - 1) {
      currentScreen++;
      updateScreens(currentScreen);
    }
  });
});

// loader page

const loader = document.querySelector(".loader");
const loaderText = document.querySelector(".loader__title");

if (loader) {
  gsap.to(loader, {
    delay: 3,
    duration: 1,
    opacity: 0,
    onComplete: () => {
      loader.style.display = "none";
    }
  });

  gsap.to(loaderText, {
    delay: 2,
    duration: 1,
    opacity: 0
  });
}


//récup prénom titre index.html 

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// config firebase (identique)
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

const userName = document.querySelector(".home__title--name");

onAuthStateChanged(auth, (user) => {
  if (user && user.displayName) {
    userName.textContent = user.displayName;
  } else {
    userName.textContent = "invité";
  }
});