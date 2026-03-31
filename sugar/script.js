const MIN = 0;
const MAX = 5;
const DEFAULT_VALUE = 2.0;

const sugarValueTop = document.getElementById("sugarValueTop");
const sugarValueBottom = document.getElementById("sugarValueBottom");
const sugarMood = document.getElementById("sugarMood");
const sugarMessage = document.getElementById("sugarMessage");
const moodBarFill = document.getElementById("moodBarFill");

const spiralSlider = document.getElementById("spiralSlider");
const spiralBase = document.getElementById("spiralBase");
const spiralFill = document.getElementById("spiralFill");
const lollipopHead = document.getElementById("lollipopHead");
const candyFloatWrap = document.querySelector(".candy-float-wrap");

const saveBtn = document.getElementById("saveBtn");
const saveBtnTop = document.getElementById("saveBtnTop");
const resetBtn = document.getElementById("resetBtn");
const quickBtns = document.querySelectorAll(".quick-btn");
const pageShell = document.querySelector(".page-shell");

let currentValue = DEFAULT_VALUE;
let isDragging = false;
let lastFloatingCount = -1;

const totalLength = spiralBase.getTotalLength();

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("sugarRecord"));

  if (saved && typeof saved.candy === "number") {
    currentValue = clamp(saved.candy, MIN, MAX);
  } else {
    currentValue = DEFAULT_VALUE;
  }

  spiralFill.style.strokeDasharray = `0 ${totalLength}`;
  spiralFill.style.strokeDashoffset = 0;
  updateUI(currentValue);
});

lollipopHead.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  isDragging = true;
  lollipopHead.classList.add("dragging");
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
});

spiralSlider.addEventListener("pointerdown", (e) => {
  if (e.target === lollipopHead) return;
  updateFromPointer(e.clientX, e.clientY);
});

spiralSlider.addEventListener("keydown", (e) => {
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

saveBtn.addEventListener("click", saveSugar);
saveBtnTop.addEventListener("click", saveSugar);

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
  updateUI(currentValue, true);
});

function onPointerMove(e) {
  if (!isDragging) return;
  updateFromPointer(e.clientX, e.clientY);
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
  lollipopHead.classList.remove("dragging");
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
}

function updateFromPointer(clientX, clientY) {
  const svg = spiralBase.ownerSVGElement;
  const rect = svg.getBoundingClientRect();

  const x = ((clientX - rect.left) / rect.width) * 760;
  const y = ((clientY - rect.top) / rect.height) * 520;

  let nearestLength = 0;
  let nearestDistance = Infinity;
  const samples = 700;

  for (let i = 0; i <= samples; i++) {
    const length = (i / samples) * totalLength;
    const point = spiralBase.getPointAtLength(length);
    const dx = point.x - x;
    const dy = point.y - y;
    const dist = dx * dx + dy * dy;

    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearestLength = length;
    }
  }

  const ratio = nearestLength / totalLength;
  const value = MIN + ratio * (MAX - MIN);
  currentValue = clamp(roundToHalf(value), MIN, MAX);
  updateUI(currentValue);
}

function updateUI(value, forceRebuildFloating = false) {
  const ratio = (value - MIN) / (MAX - MIN);
  const percent = ratio * 100;

  sugarValueTop.textContent = value.toFixed(1);
  sugarValueBottom.textContent = value.toFixed(1);
  moodBarFill.style.width = `${percent}%`;
  spiralSlider.setAttribute("aria-valuenow", value.toFixed(1));

  updateLollipopPosition(ratio);
  updateMood(value);
  updateSugarTone(ratio);
  updateFloatingCandies(ratio, forceRebuildFloating);
}

function updateLollipopPosition(ratio) {
  const length = totalLength * ratio;
  spiralFill.style.strokeDasharray = `${length} ${totalLength}`;

  const point = spiralBase.getPointAtLength(length);
  const svg = spiralBase.ownerSVGElement;
  const svgRect = svg.getBoundingClientRect();
  const sliderRect = spiralSlider.getBoundingClientRect();

  const relativeX = ((point.x / 760) * svgRect.width) + (svgRect.left - sliderRect.left);
  const relativeY = ((point.y / 520) * svgRect.height) + (svgRect.top - sliderRect.top);

  lollipopHead.style.left = `${relativeX}px`;
  lollipopHead.style.top = `${relativeY}px`;
}

function updateMood(value) {
  if (value < 1) {
    sugarMood.textContent = "Very light";
    sugarMessage.textContent = "Barely sweet. Soft, quiet, and easy on your energy.";
  } else if (value < 2.5) {
    sugarMood.textContent = "Sweet balance";
    sugarMessage.textContent = "Sweet spot. Just enough sugar to feel playful without crashing.";
  } else if (value < 4) {
    sugarMood.textContent = "Sugar high";
    sugarMessage.textContent = "Bright and buzzy. Fun for now, but definitely getting more intense.";
  } else {
    sugarMood.textContent = "Candy overload";
    sugarMessage.textContent = "Maximum swirl. Super sweet, super fast, and maybe a little too much.";
  }
}

function updateSugarTone(ratio) {
  let fill = "#f6d293";

  if (ratio < 0.2) {
    fill = "#f6d293";
  } else if (ratio < 0.45) {
    fill = "#f3b97c";
  } else if (ratio < 0.7) {
    fill = "#ef8fb4";
  } else {
    fill = "#dc5d97";
  }

  moodBarFill.style.background =
    `linear-gradient(to right, #ffe4bb 0%, ${fill} 58%, #c94986 100%)`;
}

function updateFloatingCandies(ratio, forceRebuild = false) {
  const candyCount = 3 + Math.floor(ratio * 4);

  if (!forceRebuild && candyCount === lastFloatingCount) return;

  lastFloatingCount = candyCount;
  candyFloatWrap.innerHTML = "";

  const wrapRect = candyFloatWrap.getBoundingClientRect();
  const width = wrapRect.width || 800;
  const height = wrapRect.height || 500;

  const avoidZones = [
    { x: width * 0.5, y: height * 0.56, r: Math.min(width, height) * 0.3 }
  ];

  // 완전 랜덤 zone 대신, 디자인된 위치 포인트
  const anchorPoints = [
    { x: width * 0.16, y: height * 0.18 }, // top left
    { x: width * 0.50, y: height * 0.12 }, // top center
    { x: width * 0.82, y: height * 0.19 }, // top right

    { x: width * 0.13, y: height * 0.72 }, // bottom left
    { x: width * 0.86, y: height * 0.69 }, // bottom right

    { x: width * 0.30, y: height * 0.58 }, // mid left
    { x: width * 0.71, y: height * 0.60 }  // mid right
  ];

  // 순서는 살짝 섞되 전체 구조는 유지
  const shuffledPoints = [...anchorPoints].sort(() => Math.random() - 0.5);

  let placed = 0;
  let attempts = 0;

  // 먼저 각 포인트에 하나씩
  for (let i = 0; i < shuffledPoints.length && placed < candyCount; i++) {
    const candy = tryCreateCandyNearPoint(shuffledPoints[i], avoidZones, width, height);
    if (candy) {
      candyFloatWrap.appendChild(candy);
      requestAnimationFrame(() => candy.classList.add("is-visible"));
      placed += 1;
    }
  }

  // 더 필요하면 다시 포인트 기준으로 추가
  while (placed < candyCount && attempts < 200) {
    attempts += 1;
    const point = anchorPoints[placed % anchorPoints.length];
    const candy = tryCreateCandyNearPoint(point, avoidZones, width, height);

    if (candy) {
      candyFloatWrap.appendChild(candy);
      requestAnimationFrame(() => candy.classList.add("is-visible"));
      placed += 1;
    }
  }
}

function tryCreateCandyNearPoint(point, avoidZones, width, height) {
  for (let i = 0; i < 40; i++) {
    // 크기 살짝 키움
    const size = randomBetween(36, 54);

    // 포인트 근처에서만 조금 흔들기
    const x = point.x + randomBetween(-28, 28);
    const y = point.y + randomBetween(-22, 22);

    // 화면 밖 방지
    if (x < 24 || x > width - 24 || y < 24 || y > height - 24) continue;

    let blocked = false;

    for (const area of avoidZones) {
      const dx = x - area.x;
      const dy = y - area.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < area.r) {
        blocked = true;
        break;
      }
    }

    if (blocked) continue;

    const el = document.createElement("div");
    el.className = "float-candy";

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--candy-size", `${size}px`);
    el.style.setProperty("--float-duration", `${randomBetween(5.2, 6.8).toFixed(2)}s`);
    el.style.setProperty("--float-delay", `${(-randomBetween(0, 3)).toFixed(2)}s`);

    return el;
  }

  return null;


  function tryCreateCandyInZone(zone, avoidZones) {
    for (let i = 0; i < 40; i++) {
      const size = randomBetween(22, 38);
      const x = randomBetween(zone.xMin, zone.xMax);
      const y = randomBetween(zone.yMin, zone.yMax);

      let blocked = false;

      for (const area of avoidZones) {
        const dx = x - area.x;
        const dy = y - area.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < area.r) {
          blocked = true;
          break;
        }
      }

      if (blocked) continue;

      const el = document.createElement("div");
      el.className = "float-candy";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--candy-size", `${size}px`);
      el.style.setProperty("--float-duration", `${randomBetween(5.0, 6.8).toFixed(2)}s`);
      el.style.setProperty("--float-delay", `${(-randomBetween(0, 3.5)).toFixed(2)}s`);

      return el;
    }

    return null;
  }
}

function tryCreateCandyInZone(zone, width, height, avoidZones) {
  for (let i = 0; i < 40; i++) {
    const size = randomBetween(22, 38);
    const x = randomBetween(zone.xMin, zone.xMax);
    const y = randomBetween(zone.yMin, zone.yMax);

    let blocked = false;

    for (const area of avoidZones) {
      const dx = x - area.x;
      const dy = y - area.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < area.r) {
        blocked = true;
        break;
      }
    }

    if (blocked) continue;

    const el = document.createElement("div");
    el.className = "float-candy";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--candy-size", `${size}px`);
    el.style.setProperty("--float-duration", `${randomBetween(5.0, 6.8).toFixed(2)}s`);
    el.style.setProperty("--float-delay", `${(-randomBetween(0, 3.5)).toFixed(2)}s`);

    return el;
  }

  return null;
}

function placeRandomFloatingCandies(count, width, height, centerX, centerY, avoidRadius) {
  const candyFloatWrap = document.querySelector(".candy-float-wrap");
  const placedPositions = [];

  let placed = 0;
  while (placed < count) {

    const size = randomBetween(40, 58);
    const x = randomBetween(40, width - 90);
    const y = randomBetween(42, height * 0.34);

    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < avoidRadius) continue;

    const el = document.createElement("div");
    el.className = "float-candy";

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--candy-size", `${size}px`);
    el.style.setProperty("--float-duration", `${randomBetween(4.2, 6.2).toFixed(2)}s`);
    el.style.setProperty("--float-delay", `${(-randomBetween(0, 3.5)).toFixed(2)}s`);

    candyFloatWrap.appendChild(el);

    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });

    placed += 1;
  }
}

function saveSugar() {
  localStorage.setItem(
    "sugarRecord",
    JSON.stringify({
      candy: currentValue
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
    window.location.href = "../sugarresult/index.html";
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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}