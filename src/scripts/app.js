"use strict";

import '../styles/style.scss';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";


// // Si start__btn existe : on reste sur onboarding
// const isOnboardingPage = document.querySelector('.start__btn') !== null;

// // quand on clique, direction index.html 
// // action sauvegardée et on ne devra plus le faire les prochaines fois
// if (isOnboardingPage) {
//   const startBtn = document.querySelector('.start__btn');

//   startBtn.addEventListener('click', () => {
//     localStorage.setItem('hasSeenOnboarding', 'true');
//     window.location.href = 'index.html';
//   });

// } else {
//   const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

//   if (!hasSeenOnboarding) {
//     window.location.href = 'onboarding.html';
//   }
// }



// slider onboarding

const onboardScreen = document.querySelectorAll(".onboard__screen");
const onboardBtn = document.querySelectorAll(".onboard__screen--btn");

let currentScreen = 0;

onboardScreen[currentScreen].classList.add("active");

onboardBtn.forEach((button) => {
  button.addEventListener("click", () => {

    onboardScreen[currentScreen].classList.remove("active");

    currentScreen++;

    if (currentScreen < onboardScreen.length) {
      onboardScreen[currentScreen].classList.add("active");
    }

  });
});

const loader = document.querySelector(".loader");
const loaderText = document.querySelector(".loader__title");  

gsap.to(loader, {
  delay: 3,     
  duration: 1,   
  opacity: 0
});

gsap.to(loaderText, {
  delay: 2, 
  duration: 1, 
  opacity: 0
})
