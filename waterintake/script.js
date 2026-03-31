const GOAL = 1500;
const DEFAULT_VALUE = 600;

const bottleSlider = document.getElementById("bottleSlider");
const dropletHandle = document.getElementById("dropletHandle");
const dropletPath = document.getElementById("dropletPath");
const waterFill = document.getElementById("waterFill");

const currentAmount = document.getElementById("currentAmount");
const goalAmount = document.getElementById("goalAmount");
const hydrationMessage = document.getElementById("hydrationMessage");
const hydrationMood = document.getElementById("hydrationMood");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const flowerField = document.getElementById("flowerField");
const flowerCount = document.getElementById("flowerCount");

const labelMin = document.getElementById("labelMin");
const labelMax = document.getElementById("labelMax");

const saveWaterBtn = document.getElementById("saveWaterBtn");
const quickButtons = document.querySelectorAll(".quick-btn");
const resetBtn = document.getElementById("resetBtn");
const pageShell = document.querySelector(".page-shell");
const bottleBody = document.querySelector(".bottle-body");

let currentValue = DEFAULT_VALUE;
let isDragging = false;

goalAmount.textContent = `${GOAL} ml`;

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("waterIntakeRecord"));

  if (saved && typeof saved.amount === "number") {
    currentValue = clamp(saved.amount, 0, GOAL);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  updateWaterUI(currentValue);
});

window.addEventListener("resize", () => {
  updateWaterUI(currentValue);
});

bottleSlider.addEventListener("pointerdown", (e) => {
  isDragging = true;
  bottleSlider.setPointerCapture(e.pointerId);
  updateFromPointer(e.clientY);
});

bottleSlider.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  updateFromPointer(e.clientY);
});

bottleSlider.addEventListener("pointerup", () => {
  isDragging = false;
});

bottleSlider.addEventListener("pointercancel", () => {
  isDragging = false;
});

bottleSlider.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowRight") {
    e.preventDefault();
    currentValue = clamp(currentValue + 100, 0, GOAL);
    updateWaterUI(currentValue);
  }

  if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
    e.preventDefault();
    currentValue = clamp(currentValue - 100, 0, GOAL);
    updateWaterUI(currentValue);
  }
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const addAmount = Number(button.dataset.amount);
    currentValue = clamp(currentValue + addAmount, 0, GOAL);
    updateWaterUI(currentValue);
  });
});

resetBtn.addEventListener("click", () => {
  currentValue = DEFAULT_VALUE;
  updateWaterUI(currentValue);
});

saveWaterBtn.addEventListener("click", () => {
  const percent = Math.round((currentValue / GOAL) * 100);

  localStorage.setItem(
    "waterIntakeRecord",
    JSON.stringify({
      amount: currentValue,
      percent: percent
    })
  );

  pageShell.classList.remove("saved");
  void pageShell.offsetWidth;
  pageShell.classList.add("saved");

  const original = saveWaterBtn.textContent;
  saveWaterBtn.textContent = "Saved!";

  setTimeout(() => {
    window.location.href = "../waterresult/index.html";
  }, 500);

  setTimeout(() => {
    saveWaterBtn.textContent = original;
  }, 1000);
});

function updateFromPointer(clientY) {
  const rect = bottleBody.getBoundingClientRect();

  const clampedY = clamp(clientY, rect.top, rect.bottom);
  const ratio = 1 - ((clampedY - rect.top) / rect.height);
  const stepped = Math.round((ratio * GOAL) / 100) * 100;

  currentValue = clamp(stepped, 0, GOAL);
  updateWaterUI(currentValue);
}

function updateWaterUI(amount) {
  const percent = Math.round((amount / GOAL) * 100);
  const ratio = amount / GOAL;

  currentAmount.textContent = `${amount} ml`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  waterFill.style.height = `${Math.max(percent, 0)}%`;

  bottleSlider.setAttribute("aria-valuenow", amount);

  updateDropletPosition(ratio);
  updateDropletColor(ratio);
  updateMessage(percent);
  renderFlowers(percent);
}

function updateDropletPosition(ratio) {
  const bodyHeight = bottleBody.offsetHeight;
  const bodyWidth = bottleBody.offsetWidth;

  const topPadding = 38;
  const bottomPadding = 42;
  const usable = bodyHeight - topPadding - bottomPadding;

  const y = topPadding + (1 - ratio) * usable;

  dropletHandle.style.left = `${bodyWidth / 2}px`;
  dropletHandle.style.top = `${y}px`;

  const bottleRect = bottleBody.getBoundingClientRect();
  const sliderRect = bottleSlider.getBoundingClientRect();

  const offsetY = bottleRect.top - sliderRect.top;
  const offsetX = bottleRect.left - sliderRect.left;

  labelMax.style.top = `${offsetY + topPadding - 6}px`;
  labelMax.style.left = `${offsetX - 96}px`;

  labelMin.style.top = `${offsetY + topPadding + usable - 6}px`;
  labelMin.style.left = `${offsetX - 58}px`;
}

function updateDropletColor(ratio) {
  const start = { r: 255, g: 255, b: 255 };
  const end = { r: 129, g: 181, b: 237 };

  const r = Math.round(start.r + (end.r - start.r) * ratio);
  const g = Math.round(start.g + (end.g - start.g) * ratio);
  const b = Math.round(start.b + (end.b - start.b) * ratio);

  const fill = `rgb(${r}, ${g}, ${b})`;

  const strokeStart = { r: 180, g: 225, b: 245 };
  const strokeEnd = { r: 88, g: 181, b: 222 };

  const sr = Math.round(strokeStart.r + (strokeEnd.r - strokeStart.r) * ratio);
  const sg = Math.round(strokeStart.g + (strokeEnd.g - strokeStart.g) * ratio);
  const sb = Math.round(strokeStart.b + (strokeEnd.b - strokeStart.b) * ratio);

  const stroke = `rgb(${sr}, ${sg}, ${sb})`;

  dropletPath.style.fill = fill;
  dropletPath.style.stroke = stroke;
}

function updateMessage(percent) {
  if (percent === 0) {
    hydrationMood.textContent = "Empty";
    hydrationMessage.textContent = "Your bottle is empty. Start with a small sip.";
  } else if (percent < 25) {
    hydrationMood.textContent = "Fresh start";
    hydrationMessage.textContent = "A nice start. Keep sipping through the day.";
  } else if (percent < 50) {
    hydrationMood.textContent = "Good flow";
    hydrationMessage.textContent = "Good flow. Your hydration is waking up.";
  } else if (percent < 75) {
    hydrationMood.textContent = "Blooming";
    hydrationMessage.textContent = "Looking fresh. The bottle is blooming nicely.";
  } else if (percent < 100) {
    hydrationMood.textContent = "Almost full";
    hydrationMessage.textContent = "Almost there. Your flowers are thriving.";
  } else {
    hydrationMood.textContent = "Fully hydrated";
    hydrationMessage.textContent = "Goal reached. Fully hydrated and fully blooming.";
  }
}

function renderFlowers(percent) {
  flowerField.innerHTML = "";

  const count = Math.min(6, Math.round((percent / 100) * 6));
  flowerCount.textContent = count;

  if (count === 0) return;

  const placedFlowers = [];
  const forbiddenLeftMin = 32;
  const forbiddenLeftMax = 68;
  const minGap = 11;

  for (let i = 0; i < count; i++) {
    const size = randomBetween(34, 58);
    const position = findNonOverlappingPosition(
      placedFlowers,
      size,
      forbiddenLeftMin,
      forbiddenLeftMax,
      minGap
    );

    if (!position) continue;

    placedFlowers.push({
      left: position.left,
      top: position.top,
      size: size
    });

    const flower = document.createElement("div");
    flower.className = "flower";

    const delay = (Math.random() * 2.5).toFixed(2);
    const duration = (3 + Math.random() * 3).toFixed(2);
    const spinSpeed = (5 + Math.random() * 5).toFixed(2);

    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.style.left = `${position.left}%`;
    flower.style.top = `${position.top}%`;
    flower.style.animationDelay = `${delay}s`;
    flower.style.animationDuration = `${duration}s`;
    flower.style.setProperty("--spin-speed", `${spinSpeed}s`);

    flowerField.appendChild(flower);
  }

  flowerCount.textContent = placedFlowers.length;
}

function findNonOverlappingPosition(existingFlowers, size, forbiddenMin, forbiddenMax, minGap) {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let top;
    let left;

    if (Math.random() > 0.45) {
      top = randomBetween(6, 36);
    } else {
      top = randomBetween(42, 82);
    }

    if (Math.random() < 0.5) {
      left = randomBetween(6, forbiddenMin - 8);
    } else {
      left = randomBetween(forbiddenMax + 2, 88);
    }

    const candidate = { left, top, size };

    if (
      !isInsideForbiddenZone(candidate, forbiddenMin, forbiddenMax) &&
      !isOverlapping(candidate, existingFlowers, minGap)
    ) {
      return candidate;
    }
  }

  return null;
}

function isInsideForbiddenZone(flower, forbiddenMin, forbiddenMax) {
  const flowerCenterX = flower.left + percentSizeToApproxHalf(flower.size);
  return flowerCenterX > forbiddenMin && flowerCenterX < forbiddenMax;
}

function isOverlapping(candidate, flowers, minGap) {
  for (const flower of flowers) {
    const dx = candidate.left - flower.left;
    const dy = candidate.top - flower.top;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const minDistance =
      percentRadius(candidate.size) +
      percentRadius(flower.size) +
      percentGap(minGap);

    if (distance < minDistance) {
      return true;
    }
  }

  return false;
}

function percentRadius(sizePx) {
  return sizePx / 18;
}

function percentGap(gapPx) {
  return gapPx / 18;
}

function percentSizeToApproxHalf(sizePx) {
  return sizePx / 36;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}