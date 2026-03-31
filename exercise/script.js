const MIN = 0;
const MAX = 180;
const DEFAULT_VALUE = 45;

const DUMBBELL_MIN = 260;
const DUMBBELL_MAX = 680;

const exerciseValueTop = document.getElementById("exerciseValueTop");
const exerciseValueBottom = document.getElementById("exerciseValueBottom");
const exerciseMood = document.getElementById("exerciseMood");
const exerciseMessage = document.getElementById("exerciseMessage");
const moodBarFill = document.getElementById("moodBarFill");

const dumbbellSlider = document.getElementById("dumbbellSlider");
const dumbbellWrap = document.getElementById("dumbbellWrap");
const sparkWrap = document.getElementById("sparkWrap");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("exerciseRecord"));

  if (saved && typeof saved.minutes === "number") {
    currentValue = clamp(saved.minutes, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

dumbbellSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  dumbbellSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientX);
});

dumbbellSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientX);
});

dumbbellSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

dumbbellSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

dumbbellSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    currentValue = clamp(currentValue + 5, MIN, MAX);
    updateUI(currentValue);
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    currentValue = clamp(currentValue - 5, MIN, MAX);
    updateUI(currentValue);
  }
});

saveBtn.addEventListener("click", saveExercise);
saveBtnTop.addEventListener("click", saveExercise);

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
  const rect = dumbbellSlider.getBoundingClientRect();
  const x = clamp(clientX - rect.left, 0, rect.width);
  const ratio = x / rect.width;
  const value = MIN + ratio * (MAX - MIN);

  currentValue = clamp(Math.round(value), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  exerciseValueTop.textContent = value;
  exerciseValueBottom.textContent = value;
  moodBarFill.style.width = `${percent}%`;
  dumbbellSlider.setAttribute("aria-valuenow", value);

  const dumbbellAreaWidth = dumbbellSlider.clientWidth || (window.innerWidth < 760 ? 300 : 650);
  const responsiveMax = Math.min(DUMBBELL_MAX, dumbbellAreaWidth - 10);
  const responsiveMin = Math.min(DUMBBELL_MIN, Math.max(180, dumbbellAreaWidth * 0.32));

  const dumbbellWidth = responsiveMin + (responsiveMax - responsiveMin) * ratio;
  dumbbellWrap.style.width = `${dumbbellWidth}px`;

  updateSparkPosition(dumbbellWidth, dumbbellAreaWidth);
  updateMood(value);
  updateBarbellTone(ratio);
}

function updateSparkPosition(dumbbellWidth, areaWidth) {
  const sparkWidth = window.innerWidth < 760 ? 100 : 140;
  let sparkLeft = dumbbellWidth - 110;
  sparkLeft = clamp(sparkLeft, 8, Math.max(8, areaWidth - sparkWidth));
  sparkWrap.style.left = `${sparkLeft}px`;
}

function updateMood(value) {
  if (value < 20) {
    exerciseMood.textContent = "Barely moving";
    exerciseMessage.textContent = "Very light day. A little movement could wake your body up.";
  } else if (value < 45) {
    exerciseMood.textContent = "Getting moving";
    exerciseMessage.textContent = "Nice start. Your body is warming up and finding a steady rhythm.";
  } else if (value < 75) {
    exerciseMood.textContent = "Strong balance";
    exerciseMessage.textContent = "This feels solid. You moved enough to feel active and clear.";
  } else if (value < 120) {
    exerciseMood.textContent = "Very active";
    exerciseMessage.textContent = "That is a strong workout. Powerful, focused, and full of energy.";
  } else {
    exerciseMood.textContent = "Beast mode";
    exerciseMessage.textContent = "Okay wow. You really went for it today. Maximum movement energy.";
  }
}

function updateBarbellTone(ratio) {
  let fill = "#dff3d8";
  let sparkOpacity = "0.45";

  if (ratio < 0.2) {
    fill = "#dff3d8";
    sparkOpacity = "0.45";
  } else if (ratio < 0.45) {
    fill = "#bfe8cb";
    sparkOpacity = "0.7";
  } else if (ratio < 0.7) {
    fill = "#89d39f";
    sparkOpacity = "0.9";
  } else {
    fill = "#4caf6d";
    sparkOpacity = "1";
  }

  dumbbellWrap.style.setProperty("--bar-fill", fill);
  dumbbellWrap.style.setProperty("--right-fill", fill);

  moodBarFill.style.background = `linear-gradient(to right, #dff3d8 0%, ${fill} 60%, #2f8f56 100%)`;
  sparkWrap.style.opacity = sparkOpacity;
}

function saveExercise() {
  localStorage.setItem(
    "exerciseRecord",
    JSON.stringify({
      minutes: currentValue
    })
  );

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  saveBtn.textContent = "Saved!";
  saveBtnTop.textContent = "Saved!";

  setTimeout(() => {
    window.location.href = "../exerciseresult/index.html";
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