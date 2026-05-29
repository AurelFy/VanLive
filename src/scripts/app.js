"use strict";

import '../styles/style.scss';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

const isOnboardingPage = document.querySelector('.main__onboard') !== null;
const isConnexionPage = document.querySelector('.main__con') !== null;
const isIndexPage = document.querySelector('.main__index') !== null;

if (isOnboardingPage) {
  const lastBtn = document.querySelector('.fourth__btn');

  if (lastBtn) {
    lastBtn.addEventListener('click', () => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      window.location.href = 'connexion.html';
    });
  }
} else if (isConnexionPage || isIndexPage) {
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

  if (!hasSeenOnboarding && !isConnexionPage) {
    window.location.href = 'onboarding.html';
  }
}

if (isIndexPage) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "connexion.html";
      return;
    }

    await user.reload();
    const freshUser = auth.currentUser;

    const nameEl = document.querySelector(".home__title--name"); 
    if (nameEl) {
      nameEl.textContent = freshUser.displayName || "Utilisateur";
    }
  });
}

const isAccountPage = document.querySelector(".account") !== null;

if (isAccountPage) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "connexion.html";
      return;
    }

    await user.reload();

    const freshUser = auth.currentUser;

    const nameEl = document.querySelector(".pers__name");
    const mailEl = document.querySelector(".pers__mail");

    if (nameEl) {
      nameEl.textContent = freshUser.displayName || "Utilisateur";
    }

    if (mailEl) {
      mailEl.textContent = freshUser.email || "Aucun email";
    }
  });
}

const onboardScreen = document.querySelectorAll(".onboard__screen");
const onboardBtn = document.querySelectorAll(".onboard__screen--btn");

const planScreen = document.querySelectorAll(".plan__screen");
const planBtn = document.querySelectorAll(".plan__screen--btn");

let currentOnboardScreen = 0;
let currentPlanScreen = 0;

function updateOnboardScreens(nextIndex) {
  onboardScreen.forEach((screen, i) => {
    screen.classList.remove("active", "previous");

    if (i < nextIndex) {
      screen.classList.add("previous");
    } else if (i === nextIndex) {
      screen.classList.add("active");
    }
  });
}

function updatePlanScreens(nextIndex) {
  planScreen.forEach((screen, i) => {
    screen.classList.remove("active", "previous");

    if (i < nextIndex) {
      screen.classList.add("previous");
    } else if (i === nextIndex) {
      screen.classList.add("active");
    }
  });
}

updateOnboardScreens(currentOnboardScreen);
updatePlanScreens(currentPlanScreen);

onboardBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentOnboardScreen < onboardScreen.length - 1) {
      currentOnboardScreen++;
      updateOnboardScreens(currentOnboardScreen);
    }
  });
});

planBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentPlanScreen < planScreen.length - 1) {
      currentPlanScreen++;
      updatePlanScreens(currentPlanScreen);

      if (currentPlanScreen === seplanIndex) {
        sessionStorage.setItem('hasReachedSeplan', 'true');
      }
    }
  });
});

const backBtn = document.querySelectorAll(".back__btn");

backBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentPlanScreen > 0) {
      currentPlanScreen--;
      updatePlanScreens(currentPlanScreen);
    }
  });
});

const seplanIndex = Array.from(planScreen).findIndex(s => s.classList.contains('seplan'));
const hasReachedSeplan = sessionStorage.getItem('hasReachedSeplan') === 'true';

if (hasReachedSeplan && seplanIndex !== -1) {
  currentPlanScreen = seplanIndex;
}

updatePlanScreens(currentPlanScreen);



const loader = document.querySelector(".loader");
const loaderText = document.querySelector(".loader__title");

if (loader) {
  gsap.to(loader, {
    delay: 2,
    duration: 1,
    opacity: 0,
    onComplete: () => {
      loader.style.display = "none";
    }
  });

  gsap.to(loaderText, {
    delay: 1,
    duration: 1,
    opacity: 0
  });
}

const loadFast = document.querySelector(".loadfast");
const loadFastText = document.querySelector(".loader__title");

if (loadFast) {
  gsap.to(loadFast, {
    delay: 0.5,
    duration: 1,
    opacity: 0,
    onComplete: () => {
      loadFast.style.display = "none";
    }
  });

  gsap.to(loadFastText, {
    delay: 0.5,
    duration: 1,
    opacity: 0
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const navItems = document.querySelectorAll(".detail__nav--el");
  const contentItems = document.querySelectorAll(".detail__content--el");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      contentItems.forEach(c => c.classList.remove("active"));

      item.classList.add("active");

      const target = item.dataset.target;
      document.getElementById(target).classList.add("active");
    });
  });

});