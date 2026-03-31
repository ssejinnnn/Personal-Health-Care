const MIN = 0;
const MAX = 15;
const DEFAULT_VALUE = 8;

const BED_MIN = 260;
const BED_MAX = 640;

const sleepValueTop = document.getElementById("sleepValueTop");
const sleepValueBottom = document.getElementById("sleepValueBottom");
const sleepMood = document.getElementById("sleepMood");
const sleepMessage = document.getElementById("sleepMessage");
const moodBarFill = document.getElementById("moodBarFill");

const bedSlider = document.getElementById("bedSlider");
const bedWrap = document.getElementById("bedWrap");
const zWrap = document.getElementById("zWrap");

const head = document.querySelector(".head");
const body = document.querySelector(".body");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("sleepRecord"));

  if (saved && typeof saved.hours === "number") {
    currentValue = clamp(saved.hours, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

bedSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  bedSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientX);
});

bedSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientX);
});

bedSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

bedSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

bedSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    currentValue = clamp(currentValue + 0.5, MIN, MAX);
    updateUI(currentValue);
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    currentValue = clamp(currentValue - 0.5, MIN, MAX);
    updateUI(currentValue);
  }
});

saveBtn.addEventListener("click", saveSleep);
saveBtnTop.addEventListener("click", saveSleep);

resetBtn.addEventListener("click", () => {
  currentValue = DEFAULT_VALUE;
  updateUI(currentValue);
});

quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const delta = Number(btn.dataset.add);
    currentValue = clamp(currentValue + delta, MIN, MAX);
    updateUI(currentValue);
  });
});

window.addEventListener("resize", () => {
  updateUI(currentValue);
});

function updateFromPointer(clientX) {
  const rect = bedSlider.getBoundingClientRect();
  const x = clamp(clientX - rect.left, 0, rect.width);
  const ratio = x / rect.width;
  const value = MIN + ratio * (MAX - MIN);

  currentValue = clamp(Number(value.toFixed(1)), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  sleepValueTop.textContent = value.toFixed(1);
  sleepValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  bedSlider.setAttribute("aria-valuenow", value.toFixed(1));

  const bedAreaWidth = bedSlider.clientWidth || (window.innerWidth < 760 ? 300 : 600);
  const responsiveBedMax = Math.min(BED_MAX, bedAreaWidth - 10);
  const responsiveBedMin = Math.min(BED_MIN, Math.max(170, bedAreaWidth * 0.34));

  const bedWidth = responsiveBedMin + (responsiveBedMax - responsiveBedMin) * ratio;
  bedWrap.style.width = `${bedWidth}px`;

  updateZPosition(bedWidth, bedAreaWidth);
  updateMood(value);
  updateSleeperTone(value);
}

function updateZPosition(bedWidth, bedAreaWidth) {
  const zWidth = window.innerWidth < 760 ? 110 : 140;

  let zLeft = bedWidth - 92;
  zLeft = clamp(zLeft, 18, Math.max(18, bedAreaWidth - zWidth));

  zWrap.style.left = `${zLeft}px`;
}

function updateMood(value) {
  if (value < 4) {
    sleepMood.textContent = "Too little sleep";
    sleepMessage.textContent = "You barely slept. The bed feels short, light, and a little restless.";
  } else if (value < 6.5) {
    sleepMood.textContent = "Still sleepy";
    sleepMessage.textContent = "A bit more sleep would help. You’re not fully recharged yet.";
  } else if (value < 9.5) {
    sleepMood.textContent = "Nice balance";
    sleepMessage.textContent = "Almost ideal. Your sleep feels steady, soft, and pretty balanced.";
  } else if (value < 12) {
    sleepMood.textContent = "Very rested";
    sleepMessage.textContent = "That’s a cozy amount of sleep. Calm, full, and well-rested.";
  } else {
    sleepMood.textContent = "Sleepy cloud mode";
    sleepMessage.textContent = "Okay wow. That is a very long sleep. Cozy legend behavior.";
  }
}

function updateSleeperTone(value) {
  if (value < 4) {
    head.style.background = "#b4d6eb";
    body.style.background = "#b4d6eb";
    zWrap.style.opacity = "0.55";
  } else if (value < 7) {
    head.style.background = "#97c7e7";
    body.style.background = "#97c7e7";
    zWrap.style.opacity = "0.78";
  } else if (value < 10) {
    head.style.background = "#27497d";
    body.style.background = "#27497d";
    zWrap.style.opacity = "0.92";
  } else {
    head.style.background = "#18365f";
    body.style.background = "#18365f";
    zWrap.style.opacity = "1";
  }
}

function saveSleep() {
  localStorage.setItem(
    "sleepRecord",
    JSON.stringify({
      hours: currentValue
    })
  );

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  saveBtn.textContent = "Saved!";
  saveBtnTop.textContent = "Saved!";

  setTimeout(() => {
    window.location.href = "../sleepresult/index.html";
  }, 500);
}

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  const original1 = saveBtn.textContent;
  const original2 = saveBtnTop.textContent;

  saveBtn.textContent = "Saved!";
  saveBtnTop.textContent = "Saved!";

  setTimeout(() => {
    saveBtn.textContent = original1;
    saveBtnTop.textContent = original2;
  }, 1000);


function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}