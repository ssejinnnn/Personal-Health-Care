const MIN = 0;
const MAX = 5;
const DEFAULT_VALUE = 0.5;

const smokingValueTop = document.getElementById("smokingValueTop");
const smokingValueBottom = document.getElementById("smokingValueBottom");
const smokingMood = document.getElementById("smokingMood");
const smokingMessage = document.getElementById("smokingMessage");
const moodBarFill = document.getElementById("moodBarFill");

const smokingSlider = document.getElementById("smokingSlider");
const cigaretteBody = document.getElementById("cigaretteBody");
const smokeFill = document.getElementById("smokeFill");
const filterCap = document.getElementById("filterCap");
const filterHandle = document.getElementById("filterHandle");
const smokeField = document.getElementById("smokeField");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("smokingRecord"));

  if (saved && typeof saved.cigs === "number") {
    currentValue = clamp(saved.cigs, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

smokingSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  smokingSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientX);
});

smokingSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientX);
});

smokingSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

smokingSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

smokingSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    currentValue = clamp(roundToHalf(currentValue + 0.5), MIN, MAX);
    updateUI(currentValue);
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    currentValue = clamp(roundToHalf(currentValue - 0.5), MIN, MAX);
    updateUI(currentValue);
  }
});

saveBtn.addEventListener("click", saveSmoking);
saveBtnTop.addEventListener("click", saveSmoking);

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

function updateFromPointer(clientX) {
  const rect = smokingSlider.getBoundingClientRect();
  const x = clamp(clientX - rect.left, 0, rect.width);
  const ratio = x / rect.width;
  const value = MIN + ratio * (MAX - MIN);

  currentValue = clamp(roundToHalf(value), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  smokingValueTop.textContent = value.toFixed(1);
  smokingValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  smokingSlider.setAttribute("aria-valuenow", value.toFixed(1));

  updateCigarette(ratio);
  updateMood(value);
  updateTone(ratio);
  updateSmoke(ratio);
}

function updateCigarette(ratio) {
  const wrap = document.querySelector(".cigarette-wrap");
  const wrapWidth = wrap.clientWidth || 620;

  const minFill = 36;
  const maxFill = wrapWidth * 0.94;
  const fillWidth = minFill + ratio * (maxFill - minFill);

  smokeFill.style.width = `${fillWidth}px`;
  filterHandle.style.left = `${fillWidth}px`;
  filterCap.style.left = `0px`;
}

function updateMood(value) {
  if (value < 1) {
    smokingMood.textContent = "Barely there";
    smokingMessage.textContent = "Very light. The cigarette still feels mostly untouched and the smoke stays soft.";
  } else if (value < 2.5) {
    smokingMood.textContent = "Light use";
    smokingMessage.textContent = "Controlled and moderate. The burn has started, but it still feels manageable.";
  } else if (value < 4) {
    smokingMood.textContent = "Heavy use";
    smokingMessage.textContent = "It is getting darker and denser. The cigarette feels more used and the smoke more present.";
  } else {
    smokingMood.textContent = "Chain mode";
    smokingMessage.textContent = "The cigarette looks deeply burned through. The smoke is thick, dark, and hard to ignore.";
  }
}

function updateTone(ratio) {
  let fillColor = "#c79b41";
  let handleColor = "#d5b15d";
  let smokeTone = "rgba(140,140,140,0.18)";

  if (ratio < 0.25) {
    fillColor = "#c79b41";
    handleColor = "#d9b867";
    smokeTone = "rgba(140,140,140,0.18)";
  } else if (ratio < 0.5) {
    fillColor = "#b38339";
    handleColor = "#c99a4b";
    smokeTone = "rgba(100,100,100,0.26)";
  } else if (ratio < 0.75) {
    fillColor = "#8f6430";
    handleColor = "#aa7a38";
    smokeTone = "rgba(70,70,70,0.34)";
  } else {
    fillColor = "#5f4122";
    handleColor = "#7d5328";
    smokeTone = "rgba(30,30,30,0.42)";
  }

  smokeFill.style.background = fillColor;
  filterHandle.style.background = handleColor;
  smokeField.style.setProperty("--smoke-color", smokeTone);
}

function updateSmoke(ratio) {
  smokeField.innerHTML = "";

  const fieldRect = smokeField.getBoundingClientRect();
  const bodyRect = cigaretteBody.getBoundingClientRect();

  // 시작점 더 왼쪽으로
  const startX = bodyRect.right - fieldRect.left - 140;
  const startY = bodyRect.top - fieldRect.top - 34;

  // 👉 간격 더 넓고 / 사이즈 더 큼
  const positions = [
    { x: startX + 0,   y: startY - 6,  size: 20 },
    { x: startX + 46,  y: startY - 42, size: 34 },
    { x: startX + 110, y: startY - 96, size: 52 }
  ];

  let color = "rgba(140,140,140,0.18)";

  if (ratio < 0.25) {
    color = "rgba(140, 140, 140, 0.33)";
  } else if (ratio < 0.5) {
    color = "rgba(100, 100, 100, 0.4)";
  } else if (ratio < 0.75) {
    color = "rgba(70, 70, 70, 0.43)";
  } else {
    color = "rgba(30, 30, 30, 0.58)";
  }

  positions.forEach((p, i) => {
    const puff = document.createElement("div");
    puff.className = "smoke-minimal";

    puff.style.left = `${p.x}px`;
    puff.style.top = `${p.y}px`;
    puff.style.width = `${p.size}px`;
    puff.style.height = `${p.size}px`;
    puff.style.background = color;
    puff.style.animationDelay = `${i * 0.12}s`;

    smokeField.appendChild(puff);
  });
}

function saveSmoking() {
  localStorage.setItem(
    "smokingRecord",
    JSON.stringify({
      cigs: currentValue
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
    window.location.href = "../smokingresult/index.html";
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