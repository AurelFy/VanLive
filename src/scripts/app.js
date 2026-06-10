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



// btn écran suivant onboarding et planification

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

// btn retour en arrière page planification

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


// récupération infos voyage

const inputName = document.querySelector('#input__name');
const inputDesc = document.querySelector('#input__desc');
const inputDepart = document.querySelector('#input__depart');
const inputArrivee = document.querySelector('#input__arrivee');

const choiceDepart = document.querySelector('.date__choice--dep');
const choiceArrivee = document.querySelector('.date__choice--arr');

const splanBtn = document.querySelector('.splan__btn');

// format des dates

const formatDate = (str) => {
  if (!str) return '';

  const [y, m, d] = str.split('-').map(Number);
  // m - 1 car en JS : janvier vaut 0 
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// affichage sur les écrans

function updateTripDisplay() {
  const nom = localStorage.getItem('tripName') || '';
  const desc = localStorage.getItem('tripDesc') || '';
  const depart = localStorage.getItem('tripDepart');
  const arrivee = localStorage.getItem('tripArrivee');

  document.querySelectorAll('.seplan__name, .siplan__name').forEach(el => {
    el.textContent = nom;
  });

  if (depart && arrivee) {
    const fmt = (str) => {
      const [y, m, d] = str.split('-').map(Number);

      return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long'
      });
    };

    const nbJours = (() => {
      const [y1, m1, d1] = depart.split('-').map(Number);
      const [y2, m2, d2] = arrivee.split('-').map(Number);

      return (
        Math.round(
          (new Date(y2, m2 - 1, d2) -
            new Date(y1, m1 - 1, d1)) /
          86400000
        ) + 1
      );
    })();

    const dateStr = `${fmt(depart)} — ${fmt(arrivee)} · ${nbJours} jours`;

    document.querySelectorAll('.trav__date').forEach(el => {
      el.textContent = dateStr;
    });
  }

  const siplanDesc = document.querySelector('.siplan__desc');

  if (siplanDesc) {
    siplanDesc.textContent = desc ? ` — ${desc}` : '';
  }

  if (depart) {
    document.querySelectorAll('.infos__depart').forEach(el => {
      el.textContent = formatDate(depart);
    });
  }
}

// données enregistrées et présentes meme si on quitte la page

window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('tripName');
  const savedDesc = localStorage.getItem('tripDesc');
  const savedDepart = localStorage.getItem('tripDepart');
  const savedArrivee = localStorage.getItem('tripArrivee');

  if (savedName && inputName) {
    inputName.value = savedName;
  }

  if (savedDesc && inputDesc) {
    inputDesc.value = savedDesc;
  }

  if (savedDepart && inputDepart) {
    inputDepart.value = savedDepart;

    if (choiceDepart) {
      choiceDepart.textContent = formatDate(savedDepart);
    }
  }

  if (savedArrivee && inputArrivee) {
    inputArrivee.value = savedArrivee;

    if (choiceArrivee) {
      choiceArrivee.textContent = formatDate(savedArrivee);
    }
  }

  updateTripDisplay();
});

inputName?.addEventListener('input', () => {
  localStorage.setItem('tripName', inputName.value);
});

inputDesc?.addEventListener('input', () => {
  localStorage.setItem('tripDesc', inputDesc.value);
});

inputDepart?.addEventListener('change', () => {
  localStorage.setItem('tripDepart', inputDepart.value);

  if (choiceDepart) {
    choiceDepart.textContent = formatDate(inputDepart.value);
  }

  updateTripDisplay();
});

inputArrivee?.addEventListener('change', () => {
  localStorage.setItem('tripArrivee', inputArrivee.value);

  if (choiceArrivee) {
    choiceArrivee.textContent = formatDate(inputArrivee.value);
  }

  updateTripDisplay();
});

// btn validation des inputs

if (splanBtn) {
  splanBtn.addEventListener('click', () => {
    localStorage.setItem('tripName', inputName?.value.trim() || '');
    localStorage.setItem('tripDesc', inputDesc?.value.trim() || '');
    localStorage.setItem('tripDepart', inputDepart?.value || '');
    localStorage.setItem('tripArrivee', inputArrivee?.value || '');

    updateTripDisplay();
  });
}



// loader anim

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

// État actif nav page detail

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


// Notifs toggle activé/désactivé

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


// Choix type de voyage

const travTypes = document.querySelectorAll('.tplan__cards--el');

travTypes.forEach((travType) => {
  travType.addEventListener('click', () => {
    travTypes.forEach(el => el.classList.remove('active'));
    travType.classList.add('active');
  });
});



// Ajouter une étape modal


(async function () {


  const CITIES = [
    { name: "Malmö", country: "Suède", flag: "🇸🇪" },
    { name: "Helsingør", country: "Danemark", flag: "🇩🇰" },
    { name: "Roskilde", country: "Danemark", flag: "🇩🇰" },
    { name: "Lund", country: "Suède", flag: "🇸🇪" },
    { name: "Frederiksberg", country: "Danemark", flag: "🇩🇰" },
    { name: "Køge", country: "Danemark", flag: "🇩🇰" },
    { name: "Hillerød", country: "Danemark", flag: "🇩🇰" },
    { name: "Helsingborg", country: "Suède", flag: "🇸🇪" },
    { name: "Göteborg", country: "Suède", flag: "🇸🇪" },
    { name: "Stockholm", country: "Suède", flag: "🇸🇪" },
    { name: "Aarhus", country: "Danemark", flag: "🇩🇰" },
    { name: "Aalborg", country: "Danemark", flag: "🇩🇰" },
    { name: "Odense", country: "Danemark", flag: "🇩🇰" },
    { name: "Hambourg", country: "Allemagne", flag: "🇩🇪" },
    { name: "Berlin", country: "Allemagne", flag: "🇩🇪" },
    { name: "Kiel", country: "Allemagne", flag: "🇩🇪" },
    { name: "Lübeck", country: "Allemagne", flag: "🇩🇪" },
    { name: "Flensburg", country: "Allemagne", flag: "🇩🇪" },
    { name: "Amsterdam", country: "Pays-Bas", flag: "🇳🇱" },
    { name: "Bruxelles", country: "Belgique", flag: "🇧🇪" },
    { name: "Paris", country: "France", flag: "🇫🇷" },
    { name: "Oslo", country: "Norvège", flag: "🇳🇴" },
    { name: "Bergen", country: "Norvège", flag: "🇳🇴" },
  ];

  const overlay = document.getElementById('stageModalOverlay');
  const searchInput = document.getElementById('stageCitySearch');
  const pillWrap = document.getElementById('stageCityPill');
  const suggestionsWrap = document.getElementById('stageSuggestions');
  const dateFrom = document.getElementById('stageDateFrom');
  const dateTo = document.getElementById('stageDateTo');
  const noteInput = document.getElementById('stageNote');
  const confirmBtn = document.getElementById('stageModalConfirm');
  const cancelBtn = document.getElementById('stageModalCancel');
  const addBtn = document.querySelector('.fiplan__addstage');
  const stagesContainer = document.querySelector('.fiplan');

  let selectedCity = null;

  function normalize(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function formatDateFR(str) {
    if (!str) return '';
    const [, m, d] = str.split('-');
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
  }

  function updateConfirmBtn() {
    confirmBtn.disabled = !(selectedCity && dateFrom.value && dateTo.value);
  }


  function renderSuggestions(query) {
    suggestionsWrap.innerHTML = '';
    if (!query || selectedCity) return;

    const results = CITIES.filter(c =>
      normalize(c.name).includes(normalize(query)) ||
      normalize(c.country).includes(normalize(query))
    ).slice(0, 5);

    if (results.length === 0) {
      suggestionsWrap.innerHTML = `<div class="fiplan__modal-sugg--empty">Aucune ville trouvée</div>`;
      return;
    }

    const list = document.createElement('div');
    list.className = 'fiplan__modal-sugg';

    results.forEach(city => {
      const item = document.createElement('div');
      item.className = 'fiplan__modal-sugg--el';
      item.innerHTML = `
        <div>
          <div class="fiplan__modal-sugg--name">${city.name}</div>
          <div class="fiplan__modal-sugg--country">${city.country}</div>
        </div>
        <span class="fiplan__modal-sugg--flag">${city.flag}</span>
      `;
      item.addEventListener('mousedown', e => { e.preventDefault(); selectCity(city); });
      list.appendChild(item);
    });

    suggestionsWrap.appendChild(list);
  }

  function selectCity(city) {
    selectedCity = city;
    searchInput.value = '';
    searchInput.style.display = 'none';
    suggestionsWrap.innerHTML = '';

    pillWrap.innerHTML = '';
    const pill = document.createElement('div');
    pill.className = 'fiplan__modal-city';
    pill.innerHTML = `<span>${city.flag} ${city.name}, ${city.country}</span><button>✕</button>`;
    pill.querySelector('button').addEventListener('click', () => {
      selectedCity = null;
      pillWrap.innerHTML = '';
      searchInput.style.display = '';
      searchInput.focus();
      updateConfirmBtn();
    });
    pillWrap.appendChild(pill);
    updateConfirmBtn();
  }

  searchInput.addEventListener('input', () => renderSuggestions(searchInput.value.trim()));
  searchInput.addEventListener('blur', () => setTimeout(() => { suggestionsWrap.innerHTML = ''; }, 150));


  [dateFrom, dateTo].forEach(i => i.addEventListener('change', updateConfirmBtn));


  function preventScroll(e) {
    e.preventDefault();
  }

  function openModal() {
    document.body.style.overflow = 'hidden';
    document.addEventListener('touchmove', preventScroll, { passive: false });
    selectedCity = null;
    pillWrap.innerHTML = '';
    searchInput.style.display = '';
    searchInput.value = '';
    suggestionsWrap.innerHTML = '';
    dateFrom.value = '';
    dateTo.value = '';
    noteInput.value = '';
    updateConfirmBtn();
    overlay.classList.add('fiplan__modal--open');
    setTimeout(() => searchInput.focus(), 300);
  }

  function closeModal() {
    document.body.style.overflow = '';
    document.removeEventListener('touchmove', preventScroll);
    overlay.classList.remove('fiplan__modal--open');
  }

  addBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });


  confirmBtn.addEventListener('click', () => {
    const note = noteInput.value.trim() || 'Visite de la ville';
    const newNum = stagesContainer.querySelectorAll('.fiplan__stage').length + 1;
    const dateStr = `${formatDateFR(dateFrom.value)}–${formatDateFR(dateTo.value)}`;

    const stage = document.createElement('div');
    stage.className = 'fiplan__stage fiplan__stage--new';
    stage.innerHTML =
      `<span class="fiplan__stage--num">${newNum}</span>
    <div class="fiplan__stage--infos">
      <span class="title">${selectedCity.flag} ${selectedCity.name}</span>
      <span class="infos">${dateStr} · ${note}</span>
    </div>
    <button class="fiplan__stage--delete">✕</button>
    `;

    stage.querySelector('.fiplan__stage--delete').addEventListener('click', () => {
      const syncId = stage.dataset.syncId;
      stage.remove();
    
      if (syncId) {
        document.querySelector(`.stages__indiv[data-sync-id="${syncId}"]`)?.remove();
        document.querySelector(`.progress__dot[data-sync-id="${syncId}"]`)?.remove();
      }
    
      stagesContainer.querySelectorAll('.fiplan__stage').forEach((s, i) => {
        s.querySelector('.fiplan__stage--num').textContent = i + 1;
      });
    });

    stagesContainer.insertBefore(stage, addBtn);

    const seplanStages = document.querySelector('.seplan .stages');
if (seplanStages) {
  const seplanStage = document.createElement('div');
  seplanStage.className = 'stages__indiv stages__indiv--new';
  seplanStage.dataset.syncId = Date.now(); 
  stage.dataset.syncId = seplanStage.dataset.syncId;

  seplanStage.innerHTML = `
    <span class="stages__indiv--title">${selectedCity.flag} ${selectedCity.name}</span>
    <span class="stages__indiv--sub">${dateStr} · ${note}</span>
  `;
  seplanStages.appendChild(seplanStage);


  const progressWrap = document.querySelector('.seplan .progress');
  if (progressWrap) {
    const dot = document.createElement('div');
    dot.className = 'progress__dot';
    dot.dataset.syncId = seplanStage.dataset.syncId;
    progressWrap.appendChild(dot);
  }
}

    closeModal();
  });

})();