const MIN = 0;
const MAX = 15;
const DEFAULT_VALUE = 6.0;

const stepsValueTop = document.getElementById("stepsValueTop");
const stepsValueBottom = document.getElementById("stepsValueBottom");
const stepsMood = document.getElementById("stepsMood");
const stepsMessage = document.getElementById("stepsMessage");
const moodBarFill = document.getElementById("moodBarFill");

const stepsSlider = document.getElementById("stepsSlider");
const walkerHandle = document.getElementById("walkerHandle");
const trailLayer = document.getElementById("trailLayer");
const stairsPath = document.getElementById("stairsPath");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("stepsRecord"));

  if (saved && typeof saved.steps === "number") {
    currentValue = clamp(saved.steps, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateUI(currentValue);
});

stepsSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  stepsSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientX, e.clientY);
});

stepsSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientX, e.clientY);
});

stepsSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

stepsSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

stepsSlider.addEventListener("keydown", (e) => {
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

saveBtn.addEventListener("click", saveSteps);
saveBtnTop.addEventListener("click", saveSteps);

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

function updateFromPointer(clientX, clientY) {
  const rect = stepsSlider.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const t = getClosestTOnPath(x, y, 260);
  currentValue = clamp(roundToHalf(t * MAX), MIN, MAX);
  updateUI(currentValue);
}

function getClosestTOnPath(x, y, samples = 260) {
  let bestT = 0;
  let bestDist = Infinity;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = getPathPoint(t);
    const dx = x - p.x;
    const dy = y - p.y;
    const dist = dx * dx + dy * dy;

    if (dist < bestDist) {
      bestDist = dist;
      bestT = t;
    }
  }

  return bestT;
}

function getPathPoint(t) {
  const totalLength = stairsPath.getTotalLength();
  const point = stairsPath.getPointAtLength(totalLength * t);
  return { x: point.x, y: point.y };
}

function getPathAngle(t) {
  const a = getPathPoint(clamp(t - 0.005, 0, 1));
  const b = getPathPoint(clamp(t + 0.005, 0, 1));
  return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
}

function getPerpendicularOffset(t, amount) {
  const a = getPathPoint(clamp(t - 0.005, 0, 1));
  const b = getPathPoint(clamp(t + 0.005, 0, 1));

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;

  return {
    x: (-dy / len) * amount,
    y: (dx / len) * amount
  };
}

function updateUI(value) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  stepsValueTop.textContent = value.toFixed(1);
  stepsValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  stepsSlider.setAttribute("aria-valuenow", value.toFixed(1));

  updateHandle(ratio);
  updateTrail(value);
  updateMood(value);
}

function updateHandle(ratio) {
  const p = getPathPoint(ratio);
  const angle = getPathAngle(ratio);
  const inward = getPerpendicularOffset(ratio, 2);

  walkerHandle.style.left = `${p.x + inward.x}px`;
  walkerHandle.style.top = `${p.y + inward.y}px`;
  walkerHandle.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
}

function updateTrail(value) {
  trailLayer.innerHTML = "";

  if (value < 1) return;

  const handleT = clamp(value / MAX, 0.03, 0.97);
  const gapFromHandle = 0.085;
  const startT = 0.06;
  const endT = Math.max(startT, handleT - gapFromHandle);

  if (endT <= startT) return;

  const footprintCount = Math.max(1, Math.floor(value * 0.6));

  for (let i = 0; i < footprintCount; i++) {
    const progress = footprintCount === 1 ? 0 : i / (footprintCount - 1);
    const t = startT + (endT - startT) * progress;

    const point = getPathPoint(t);
    const angle = getPathAngle(t);
    const sideOffset = i % 2 === 0 ? -4 : 4;
    const offset = getPerpendicularOffset(t, sideOffset);

    const foot = document.createElement("div");
    foot.className = "trail-footprint";
    foot.style.left = `${point.x + offset.x}px`;
    foot.style.top = `${point.y + offset.y}px`;
    foot.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
    foot.style.animationDelay = `${i * 0.012}s`;

    foot.innerHTML = `
      <div class="toe t1"></div>
      <div class="toe t2"></div>
      <div class="toe t3"></div>
      <div class="toe t4"></div>
      <div class="toe t5"></div>
      <div class="sole"></div>
    `;

    trailLayer.appendChild(foot);
  }
}

function updateMood(value) {
  if (value < 3) {
    stepsMood.textContent = "Very light";
    stepsMessage.textContent = "A quieter day. Just a few steps started to build.";
  } else if (value < 7.5) {
    stepsMood.textContent = "Strong balance";
    stepsMessage.textContent = "A nice steady pace. Your trail is building cleanly through the day.";
  } else if (value < 11) {
    stepsMood.textContent = "Active";
    stepsMessage.textContent = "You kept moving. The stair path feels full and energetic.";
  } else {
    stepsMood.textContent = "Long walk";
    stepsMessage.textContent = "A strong walking day. Your path is nearly filled from bottom to top.";
  }
}

function saveSteps() {
  localStorage.setItem(
    "stepsRecord",
    JSON.stringify({
      steps: currentValue
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
    window.location.href = "../screentimeresult/index.html";
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