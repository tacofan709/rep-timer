let timerInterval;
let currentRound = 0;
let isWork = true;
let timeRemaining = 0;
let isPaused = false;
let audioCtx;

const app = document.getElementById("app");
const statusText = document.getElementById("status");
const timerDisplay = document.getElementById("timer");

const rounds = document.getElementById("rounds");
const workTime = document.getElementById("workTime");
const restTime = document.getElementById("restTime");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const skipBtn = document.getElementById("skipBtn");
const resetBtn = document.getElementById("resetBtn");

function playBeep() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.frequency.value = 800;
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

function updateDisplay() {
  const min = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
  const sec = (timeRemaining % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
}

function setState(state, label) {
  app.className = state;
  statusText.textContent = label;
  playBeep();
}

function nextInterval() {
  if (isWork) {
    isWork = false;
    timeRemaining = Number(restTime.value);
    setState("rest", "REST");
  } else {
    currentRound++;
    if (currentRound >= Number(rounds.value)) {
      clearInterval(timerInterval);
      setState("done", "DONE");
      pauseBtn.disabled = true;
      skipBtn.disabled = true;
      return;
    }
    isWork = true;
    timeRemaining = Number(workTime.value);
    setState("work", "WORK");
  }
}

function tick() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateDisplay();
  } else {
    nextInterval();
    updateDisplay();
  }
}

function startCountdown() {
  let countdown = 3;
  setState("idle", "GET READY");
  timerDisplay.textContent = countdown;

  timerInterval = setInterval(() => {
    countdown--;
    timerDisplay.textContent = countdown;
    playBeep();

    if (countdown === 0) {
      clearInterval(timerInterval);
      startWorkout();
    }
  }, 1000);
}

function startWorkout() {
  currentRound = 0;
  isWork = true;
  timeRemaining = Number(workTime.value);
  setState("work", "WORK");
  updateDisplay();
  timerInterval = setInterval(tick, 1000);
}

startBtn.onclick = () => {
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  skipBtn.disabled = false;
  startCountdown();
};

pauseBtn.onclick = () => {
  if (isPaused) {
    timerInterval = setInterval(tick, 1000);
    pauseBtn.textContent = "Pause";
    isPaused = false;
  } else {
    clearInterval(timerInterval);
    pauseBtn.textContent = "Resume";
    setState("paused", "PAUSED");
    isPaused = true;
  }
};

skipBtn.onclick = () => {
  nextInterval();
  updateDisplay();
};

resetBtn.onclick = () => {
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  skipBtn.disabled = true;
  pauseBtn.textContent = "Pause";
  isPaused = false;
  setState("idle", "READY");
  timerDisplay.textContent = "00:00";
};
