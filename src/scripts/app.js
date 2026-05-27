"use strict";

import '../styles/style.scss';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

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

const onboardScreen = document.querySelectorAll(".onboard__screen");
const onboardBtn = document.querySelectorAll(".onboard__screen--btn");

const planScreen = document.querySelectorAll(".plan__screen");
const planBtn = document.querySelectorAll(".plan__screen--btn");

let currentOnboardScreen = 0;
let currentPlanScreen = 0;

// MAJ Onboarding
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

// MAJ Planification
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

// Btn Onboard
onboardBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentOnboardScreen < onboardScreen.length - 1) {
      currentOnboardScreen++;
      updateOnboardScreens(currentOnboardScreen);
    }
  });
});

// Btn Plan
planBtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentPlanScreen < planScreen.length - 1) {
      currentPlanScreen++;
      updatePlanScreens(currentPlanScreen);
    }
  });
});

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


document.addEventListener("DOMContentLoaded", () => {

  const navItems = document.querySelectorAll(".detail__nav--el");
  const contentItems = document.querySelectorAll(".detail__content--el");

  navItems.forEach(item => {
      item.addEventListener("click", () => {

          // retirer les active
          navItems.forEach(i => i.classList.remove("active"));
          contentItems.forEach(c => c.classList.remove("active"));

          // ajouter active sur l’onglet cliqué
          item.classList.add("active");

          // afficher le bon contenu
          const target = item.dataset.target;
          document.getElementById(target).classList.add("active");
      });
  });

});



