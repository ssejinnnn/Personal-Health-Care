const MIN = 0;
const MAX = 5;
const DEFAULT_VALUE = 2.0;

const stressValueTop = document.getElementById("stressValueTop");
const stressValueBottom = document.getElementById("stressValueBottom");
const stressMood = document.getElementById("stressMood");
const stressMessage = document.getElementById("stressMessage");
const moodBarFill = document.getElementById("moodBarFill");

const stressSlider = document.getElementById("stressSlider");
const thermoFill = document.getElementById("thermoFill");
const thermoHandle = document.getElementById("thermoHandle");
const bulbFace = document.getElementById("bulbFace");
const thermoBulb = document.getElementById("thermoBulb");
const thermoStem = document.getElementById("thermoStem");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("stressRecord"));

  if (saved && typeof saved.level === "number") {
    currentValue = clamp(saved.level, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

stressSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  stressSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientY);
});

stressSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientY);
});

stressSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

stressSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

stressSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowRight") {
    e.preventDefault();
    currentValue = clamp(roundToHalf(currentValue + 0.5), MIN, MAX);
    updateUI(currentValue);
  }

  if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
    e.preventDefault();
    currentValue = clamp(roundToHalf(currentValue - 0.5), MIN, MAX);
    updateUI(currentValue);
  }
});

saveBtn.addEventListener("click", saveStress);
saveBtnTop.addEventListener("click", saveStress);

resetBtn.addEventListener("click", () => {
  currentValue = DEFAULT_VALUE;
  updateUI(currentValue);
});

quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const delta = Number(btn.dataset.add);
    currentValue = clamp(roundToHalf(currentValue + delta), MIN, MAX);
    updateUI(currentValue);
  });
});

window.addEventListener("resize", () => {
  updateUI(currentValue);
});

function updateFromPointer(clientY) {
  const stemRect = thermoStem.getBoundingClientRect();
  const y = clamp(clientY - stemRect.top, 0, stemRect.height);
  const ratio = 1 - (y / stemRect.height);
  const value = MIN + ratio * (MAX - MIN);

  currentValue = clamp(roundToHalf(value), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  stressValueTop.textContent = value.toFixed(1);
  stressValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  stressSlider.setAttribute("aria-valuenow", value.toFixed(1));

  updateThermometer(ratio);
  updateMood(value);
  updateTone(ratio);
}

function updateThermometer(ratio) {
  const stemHeight = thermoStem.clientHeight || 280;
  const fillHeight = 18 + ratio * (stemHeight - 18);

  thermoFill.style.height = `${fillHeight}px`;

  const handleY = stemHeight - fillHeight;
  thermoHandle.style.left = `50%`;
  thermoHandle.style.top = `${handleY}px`;
}

function updateMood(value) {
  if (value < 2.5) {
    stressMood.textContent = "Very calm";
    stressMessage.textContent = "Almost no pressure. Quiet, light, and easy to move through.";
    bulbFace.textContent = "◡̎";
  } else if (value < 3.2) {
    stressMood.textContent = "Steady focus";
    stressMessage.textContent = "Balanced and manageable. There is some pressure, but it still feels in control.";
    bulbFace.textContent = "⍨";
  } else if (value < 4) {
    stressMood.textContent = "Alert";
    stressMessage.textContent = "You are carrying more tension now. It feels sharper, quicker, and less soft.";
    bulbFace.textContent = "⍨";
  } else {
    stressMood.textContent = "Overloaded";
    stressMessage.textContent = "Everything feels maxed out. High tension, high pressure, and barely any room to rest.";
    bulbFace.textContent = "◠̈";
  }
}

function updateTone(ratio) {
  let bulbColor = "#5aa03d";
  let handleColor = "#cfe3bb";
  let trackGlow = "none";

  if (ratio < 0.25) {
    bulbColor = "#5aa03d";
    handleColor = "#cfe3bb";
    trackGlow = "0 0 0 0 rgba(0,0,0,0)";
  } else if (ratio < 0.5) {
    bulbColor = "#f1de57";
    handleColor = "#f1de57";
    trackGlow = "0 0 18px rgba(241,222,87,0.10)";
  } else if (ratio < 0.75) {
    bulbColor = "#ef9a4e";
    handleColor = "#ef9a4e";
    trackGlow = "0 0 20px rgba(239,154,78,0.12)";
  } else {
    bulbColor = "#f24932";
    handleColor = "#f24932";
    trackGlow = "0 0 24px rgba(242,73,50,0.16)";
  }

  thermoBulb.style.background = bulbColor;
  thermoHandle.style.background = handleColor;
  thermoStem.style.boxShadow = trackGlow;

  const vibration = document.getElementById("stressVibration");
const lines = vibration.querySelectorAll(".v-line");

function updateVibration(ratio){}
  let opacity = 0;
  let speed = 1;

  if (ratio < 0.25){
    opacity = 0.05;
    speed = 1.4;
  }
  else if (ratio < 0.5){
    opacity = 0.15;
    speed = 1.1;
  }
  else if (ratio < 0.75){
    opacity = 0.35;
    speed = 0.8;
  }
  else{
    opacity = 0.7;
    speed = 0.5;
  }

  lines.forEach((line, i)=>{
    line.style.opacity = opacity;
    line.style.animationDuration = `${speed}s`;
    line.style.animationDelay = `${i * 0.08}s`;
  });
}
lines.forEach((line)=>{
  if (ratio > 0.7){
    line.style.filter = "drop-shadow(0 0 8px rgba(255,80,60,0.6))";
  } else {
    line.style.filter = "none";
  }
});

function saveStress() {
  localStorage.setItem(
    "stressRecord",
    JSON.stringify({
      level: currentValue
    })
  );

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  const original1 = saveBtn.textContent;
  const original2 = saveBtnTop.textContent;

  saveBtn.textContent = "Saved!";
  saveBtnTop.textContent = "Saved!";

  setTimeout(() => {
    window.location.href = "../stressresult/index.html";
  }, 500);

  setTimeout(() => {
    saveBtn.textContent = original1;
    saveBtnTop.textContent = original2;
  }, 1000);
}

function roundToHalf(num) {
  return Math.round(num * 2) / 2;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}