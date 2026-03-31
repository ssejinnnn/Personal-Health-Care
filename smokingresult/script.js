const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

const THRESHOLD = 2.5; // 50% of max 5

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("smokingRecord"));

  if (!saved || typeof saved.cigs !== "number") {
    setGoodMode();
    return;
  }

  if (saved.cigs >= THRESHOLD) {
    setBadMode(saved.cigs);
  } else {
    setGoodMode(saved.cigs);
  }
});

function setGoodMode(value = 0) {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“Alright.”";
  resultBottom.textContent = "You kept it low today.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 76, 24], [18, 20, 18], [32, 12, 32],
    [46, 74, 20], [64, 18, 26], [78, 30, 16],
    [88, 72, 30], [92, 18, 22]
  ];

  positions.forEach((pos, i) => {
    const puff = document.createElement("div");
    puff.className = "result-soft-smoke";
    puff.style.left = `${pos[0]}%`;
    puff.style.top = `${pos[1]}%`;
    puff.style.width = `${pos[2]}px`;
    puff.style.height = `${pos[2]}px`;
    puff.style.animationDelay = `${i * 0.14}s`;
    decoLayer.appendChild(puff);
  });
}

function setBadMode(value = THRESHOLD) {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Hmm...”";
  resultBottom.textContent = "That’s a bit much today.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18, 26], [18, 74, 34], [32, 10, 44],
    [46, 78, 28], [62, 20, 38], [74, 68, 22],
    [86, 16, 54], [92, 76, 34]
  ];

  positions.forEach((pos, i) => {
    const puff = document.createElement("div");
    puff.className = "result-dark-smoke";
    puff.style.left = `${pos[0]}%`;
    puff.style.top = `${pos[1]}%`;
    puff.style.width = `${pos[2]}px`;
    puff.style.height = `${pos[2]}px`;
    puff.style.animationDelay = `${i * 0.16}s`;
    decoLayer.appendChild(puff);
  });
}