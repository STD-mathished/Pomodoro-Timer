
import './src/style.css';

// Valeurs par défaut
const defaultSettings = {
  sessionLength: 25,
  breakLength: 5,
  sessionsCompleted: 0
};

// Charger les données ou les initialiser
let settings = JSON.parse(localStorage.getItem("pomodoro-settings")) || defaultSettings;

// Mettre à jour l'affichage
function updateDisplay() {
  document.getElementById("session-length").textContent = settings.sessionLength;
  document.getElementById("break-length").textContent = settings.breakLength;
  document.querySelector("h2 span:first-child").textContent = settings.sessionLength.toString().padStart(2, "0");
  document.querySelector("h2 span:last-child").textContent = "00";
}
updateDisplay();

// Sauvegarder dans localStorage
function saveSettings() {
  localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
}

// Gestion des boutons Session
document.getElementById("increase-session").addEventListener("click", () => {
  settings.sessionLength++;
  saveSettings();
  updateDisplay();
});

document.getElementById("decrease-session").addEventListener("click", () => {
  if (settings.sessionLength > 1) {
    settings.sessionLength--;
    saveSettings();
    updateDisplay();
  }
});

// Gestion des boutons Pause
document.getElementById("increase-break").addEventListener("click", () => {
  settings.breakLength++;
  saveSettings();
  updateDisplay();
});

document.getElementById("decrease-break").addEventListener("click", () => {
  if (settings.breakLength > 1) {
    settings.breakLength--;
    saveSettings();
    updateDisplay();
  }
});

// Timer avec enchaînement session -> pause
let interval = null;
let isSession = true;
let secondsLeft;

function startTimer() {
  if (interval) return;

  secondsLeft = (isSession ? settings.sessionLength : settings.breakLength) * 60;

  interval = setInterval(() => {
    secondsLeft--;

    const min = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const sec = (secondsLeft % 60).toString().padStart(2, "0");

    document.querySelector("h2 span:first-child").textContent = min;
    document.querySelector("h2 span:last-child").textContent = sec;

    if (secondsLeft <= 0) {
      clearInterval(interval);
      interval = null;

      if (isSession) {
        settings.sessionsCompleted++;
        saveSettings();
        alert("Session terminée ! Pause en cours.");
        isSession = false;
        startTimer(); // Enchaîne vers la pause
      } else {
        alert("Pause terminée ! Nouvelle session.");
        isSession = true;
        updateDisplay(); // Réinitialise affichage
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isSession = true;
  updateDisplay();
}

// Boutons Start / Reset
document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
