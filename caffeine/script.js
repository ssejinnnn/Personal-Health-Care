const MIN = 0;
const MAX = 5;
const DEFAULT_VALUE = 2;

const caffeineValueTop = document.getElementById("caffeineValueTop");
const caffeineValueBottom = document.getElementById("caffeineValueBottom");
const caffeineMood = document.getElementById("caffeineMood");
const caffeineMessage = document.getElementById("caffeineMessage");
const moodBarFill = document.getElementById("moodBarFill");

const caffeineSlider = document.getElementById("caffeineSlider");
const sliderFill = document.getElementById("sliderFill");
const cupHandle = document.getElementById("cupHandle");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

const beans = document.querySelectorAll(".bean");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("caffeineRecord"));

  if (saved && typeof saved.cups === "number") {
    currentValue = clamp(saved.cups, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

caffeineSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  caffeineSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientX);
});

caffeineSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientX);
});

caffeineSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

caffeineSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

caffeineSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    currentValue = clamp(roundHalf(currentValue + 0.5), MIN, MAX);
    updateUI(currentValue);
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    currentValue = clamp(roundHalf(currentValue - 0.5), MIN, MAX);
    updateUI(currentValue);
  }
});

saveBtn.addEventListener("click", saveCaffeine);
saveBtnTop.addEventListener("click", saveCaffeine);

resetBtn.addEventListener("click", () => {
  currentValue = DEFAULT_VALUE;
  updateUI(currentValue);
});

quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const delta = Number(btn.dataset.add);
    currentValue = clamp(roundHalf(currentValue + delta), MIN, MAX);
    updateUI(currentValue);
  });
});

window.addEventListener("resize", () => {
  updateUI(currentValue);
});

function updateFromPointer(clientX) {
  const rect = caffeineSlider.getBoundingClientRect();
  const x = clamp(clientX - rect.left, 0, rect.width);
  const ratio = x / rect.width;
  const value = MIN + ratio * (MAX - MIN);

  currentValue = clamp(roundHalf(value), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  caffeineValueTop.textContent = value.toFixed(1);
  caffeineValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  sliderFill.style.width = `${percent}%`;
  caffeineSlider.setAttribute("aria-valuenow", value.toFixed(1));

  updateCupPosition(percent);
  updateMood(value);
  updateCupTone(value);
  updateBeans(value);
}

function updateCupPosition(percent) {
  const sliderRect = caffeineSlider.getBoundingClientRect();
  const handleWidth = cupHandle.offsetWidth || 150;

  const minPx = handleWidth * 0.42;                 // 왼쪽 여백
  const maxPx = sliderRect.width - handleWidth * 0.42; // 오른쪽 여백

  const x = minPx + (maxPx - minPx) * (percent / 100);
  cupHandle.style.left = `${x}px`;
}

function updateMood(value) {
  if (value < 1) {
    caffeineMood.textContent = "Very light";
    caffeineMessage.textContent = "Almost no caffeine. Calm, soft, and very low-key energy.";
  } else if (value < 2) {
    caffeineMood.textContent = "Easy start";
    caffeineMessage.textContent = "A gentle boost. Just enough to wake up without pushing too hard.";
  } else if (value < 3.5) {
    caffeineMood.textContent = "Steady energy";
    caffeineMessage.textContent = "Nice balance. Just enough to feel awake without going overboard.";
  } else if (value < 4.5) {
    caffeineMood.textContent = "Buzzing";
    caffeineMessage.textContent = "Okay, you are definitely running on caffeine now. Big energy.";
  } else {
    caffeineMood.textContent = "Overloaded";
    caffeineMessage.textContent = "That is a lot of caffeine. Maximum buzz mode unlocked.";
  }
}

function updateCupTone(value) {
  let brown1 = "#f1dcc8";
  let brown2 = "#c7966d";
  let brown4 = "#6f4632";

  if (value < 1) {
    brown1 = "#f3e4d6";
    brown2 = "#ddb28d";
    brown4 = "#8a5b41";
  } else if (value < 2.5) {
    brown1 = "#f1dcc8";
    brown2 = "#c7966d";
    brown4 = "#6f4632";
  } else if (value < 4) {
    brown1 = "#edd3bb";
    brown2 = "#b97d56";
    brown4 = "#603a29";
  } else {
    brown1 = "#e6c5a8";
    brown2 = "#a96a46";
    brown4 = "#4f2d21";
  }

  sliderFill.style.background = `linear-gradient(to right, ${brown2} 0%, ${brown4} 100%)`;
  moodBarFill.style.background = `linear-gradient(to right, ${brown1} 0%, ${brown2} 45%, ${brown4} 100%)`;

  const pour = document.querySelector(".pour-stream");
  if (pour) {
    pour.style.background = `linear-gradient(to bottom, ${brown2} 0%, ${brown4} 100%)`;
  }
}

function updateBeans(value) {
  const count = Math.ceil(value);

  beans.forEach((bean, index) => {
    if (index < count) {
      bean.classList.add("show");
      bean.style.transitionDelay = `${index * 0.06}s`;
    } else {
      bean.classList.remove("show");
      bean.style.transitionDelay = "0s";
    }
  });
}

function saveCaffeine() {
  localStorage.setItem(
    "caffeineRecord",
    JSON.stringify({
      cups: currentValue
    })
  );

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  saveBtn.textContent = "Saved!";
  saveBtnTop.textContent = "Saved!";

  setTimeout(() => {
    window.location.href = "../caffeineresult/index.html";
  }, 500);
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function roundHalf(num) {
  return Math.round(num * 2) / 2;
}