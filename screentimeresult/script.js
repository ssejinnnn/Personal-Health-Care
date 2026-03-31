const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("stepsRecord"));

  if (!saved || typeof saved.steps !== "number") {
    setBadMode(0);
    return;
  }

  const steps = saved.steps;

  if (steps >= 7.5) {
    setGoodMode(steps);
  } else {
    setBadMode(steps);
  }
});

function footprintHTML(extraClass = "") {
  return `
    <div class="result-foot ${extraClass}">
      <div class="toe t1"></div>
      <div class="toe t2"></div>
      <div class="toe t3"></div>
      <div class="toe t4"></div>
      <div class="toe t5"></div>
      <div class="sole"></div>
    </div>
  `;
}

function setGoodMode(steps) {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  if (steps >= 12) {
    resultTop.textContent = "“Yesss!”";
    resultBottom.textContent = "Your path climbed all the way up.Ꙭ̮”";
  } else if (steps >= 10) {
    resultTop.textContent = "“So good!”";
    resultBottom.textContent = "You built a strong active trail today.Ꙭ̮”";
  } else {
    resultTop.textContent = "“Nice!”";
    resultBottom.textContent = "Your path built up beautifully today.Ꙭ̮”";
  }

  decoLayer.innerHTML = "";

  const stairs = document.createElement("div");
  stairs.className = "result-stair";
  stairs.style.left = "8%";
  stairs.style.top = "16%";
  stairs.style.width = "84%";
  stairs.style.height = "64%";
  stairs.innerHTML = `
    <svg viewBox="0 0 600 360" preserveAspectRatio="none" width="100%" height="100%">
      <path d="M60 290 L60 240 L190 240 L190 180 L320 180 L320 115 L450 115 L450 58 L560 58" />
    </svg>
  `;
  decoLayer.appendChild(stairs);

  const positions = [
    { left: 12, top: 63, cls: "small good rotate-left" },
    { left: 24, top: 61, cls: "small good rotate-right" },
    { left: 36, top: 48, cls: "small good rotate-left" },
    { left: 50, top: 38, cls: "small good rotate-right" },
    { left: 64, top: 23, cls: "small good rotate-left" },
    { left: 77, top: 13, cls: "small good rotate-right" }
  ];

  positions.forEach((pos, i) => {
    const foot = document.createElement("div");
    foot.style.position = "absolute";
    foot.style.left = `${pos.left}%`;
    foot.style.top = `${pos.top}%`;
    foot.style.animationDelay = `${i * 0.12}s`;
    foot.innerHTML = footprintHTML(pos.cls);
    decoLayer.appendChild(foot);
  });

  const mainFoot = document.createElement("div");
  mainFoot.style.position = "absolute";
  mainFoot.style.left = "83%";
  mainFoot.style.top = "12%";
  mainFoot.innerHTML = footprintHTML("large good rotate-right");
  decoLayer.appendChild(mainFoot);
}

function setBadMode(steps) {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  if (steps >= 4) {
    resultTop.textContent = "“Hmm...”";
    resultBottom.textContent = "your path started, but could go higher.Ꙭ̯”";
  } else {
    resultTop.textContent = "“Oops...”";
    resultBottom.textContent = "maybe take a few more steps today.Ꙭ̯”";
  }

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 16], [44, 78],
    [62, 26], [74, 70], [88, 20], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const dot = document.createElement("div");
    dot.className = "result-dot";
    dot.style.left = `${pos[0]}%`;
    dot.style.top = `${pos[1]}%`;
    dot.style.width = `${14 + (i % 3) * 8}px`;
    dot.style.height = dot.style.width;
    dot.style.animationDelay = `${i * 0.15}s`;
    decoLayer.appendChild(dot);
  });

  const lowFoot = document.createElement("div");
  lowFoot.style.position = "absolute";
  lowFoot.style.left = "18%";
  lowFoot.style.top = "58%";
  lowFoot.innerHTML = footprintHTML("large bad rotate-left");
  decoLayer.appendChild(lowFoot);
}