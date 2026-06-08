"use strict";

import '../styles/style.scss';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, deleteUser, signOut } from "firebase/auth";

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
  const skipBtn = document.querySelector('.onboard__skip');

  if (lastBtn) {
    lastBtn.addEventListener('click', () => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      window.location.href = 'connexion.html';
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      window.location.href = 'connexion.html';
    });
  }

} else if (isConnexionPage) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });

} else {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "onboarding.html";
    }
  });
}

if (isIndexPage) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "connexion.html";
      return;
    }

    await user.reload();
    const infoUser = auth.currentUser;

    const nameEl = document.querySelector(".home__title--name");
    if (nameEl) {
      nameEl.textContent = infoUser.displayName || "Utilisateur";
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

    const infoUser = auth.currentUser;

    const nameEl = document.querySelector(".pers__name");
    const mailEl = document.querySelector(".pers__mail");

    if (nameEl) {
      nameEl.textContent = infoUser.displayName || "Utilisateur";
    }

    if (mailEl) {
      mailEl.textContent = infoUser.email || "**";
    }
  });

  const signOutBtn = document.querySelector(".account__signout");
  const deleteBtn = document.querySelector(".account__suppr");

  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      await signOut(auth);
      localStorage.removeItem('hasSeenOnboarding');
      window.location.href = "connexion.html";
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm("Supprimer définitivement votre compte ?");
      if (!confirmed) return;

      const user = auth.currentUser;
      if (!user) return;

      try {
        await deleteUser(user);
        window.location.href = "connexion.html";
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          alert("Pour des raisons de sécurité, reconnectez-vous avant de supprimer votre compte.");
          await signOut(auth);
          window.location.href = "connexion.html";
        } else {
          alert("Erreur : " + error.message);
        }
      }
    });
  }
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


const inputDepart = document.querySelector('#input__depart');
const inputArrivee = document.querySelector('#input__arrivee');

const choiceDepart = document.querySelector('.date__choice--dep');
const choiceArrivee = document.querySelector('.date__choice--arr');

const formatDate = (str) => {
  if (!str) return '';

  const [y, m, d] = str.split('-').map(Number);

  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

inputDepart?.addEventListener('change', () => {
  choiceDepart.textContent = formatDate(inputDepart.value);
});

inputArrivee?.addEventListener('change', () => {
  choiceArrivee.textContent = formatDate(inputArrivee.value);
});


const splanBtn = document.querySelector('.splan__btn');

if (splanBtn) {
  splanBtn.addEventListener('click', () => {
    const nom = document.querySelector('#input__name')?.value?.trim();
    const desc = document.querySelector('#input__desc')?.value?.trim();
    const depart = document.querySelector('#input__depart')?.value;
    const arrivee = document.querySelector('#input__arrivee')?.value;

    document.querySelectorAll('.seplan__name, .siplan__name').forEach(el => {
      el.textContent = nom || '';
    });

    if (depart && arrivee) {
      const fmt = (str) => {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
      };
      const nbJours = (() => {
        const [y1, m1, d1] = depart.split('-').map(Number);
        const [y2, m2, d2] = arrivee.split('-').map(Number);
        return Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000) + 1;  // divisé en nombre de milisecondes dans un jour car js retourne la différence des 2 dates en milisecondes. donc on transfrome en jour
      })();
      const dateStr = `${fmt(depart)} — ${fmt(arrivee)} · ${nbJours} jours`;

      document.querySelectorAll('.trav__date').forEach(el => {
        el.textContent = dateStr;
      });
    }

    const siplanDesc = document.querySelector('.siplan__desc');
    if (siplanDesc) siplanDesc.textContent = desc ? ` — ${desc}` : '';
  });
}




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



let counter = 0;

document.querySelectorAll('.notif[data-type]').forEach(label => {
  let active = false;

  label.addEventListener('click', () => {
    active = !active;
    addToast(active ? 'success' : 'warning', `${label.dataset.msg} ${active ? 'activé' : 'désactivé'}`);
  });
});

function addToast(type, msg) {
  const container = document.querySelector('.notif__container');
  const id = 'toast-' + (++counter);

  const el = document.createElement('div');
  el.className = `notif__container--el ${type}`;
  el.id = id;
  el.textContent = msg;

  container.appendChild(el);
  el.addEventListener('click', () => removeToast(id));
  setTimeout(() => removeToast(id), 1000);
}

function removeToast(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'fadeOut 0.3s ease-in-out';
  setTimeout(() => el.remove(), 200);
}


const travTypes = document.querySelectorAll('.tplan__cards--el');


travTypes.forEach((travType) => {
  travType.addEventListener('click', () => {
    travTypes.forEach(el => el.classList.remove('active'));
    travType.classList.add('active');
  });
});