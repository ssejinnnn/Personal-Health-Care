const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

const THRESHOLD = 2.5; // 50% of max 5

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("stressRecord"));

  if (!saved || typeof saved.level !== "number") {
    setGoodMode();
    return;
  }

  // 50% 이상이면 bad
  if (saved.level >= THRESHOLD) {
    setBadMode(saved.level);
  } else {
    setGoodMode(saved.level);
  }
});

function setGoodMode(value = 0) {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“Nice.”";
  resultBottom.textContent = "You kept it steady today.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 74], [32, 14], [44, 78],
    [60, 22], [72, 70], [86, 16], [92, 76]
  ];

  positions.forEach((pos, i) => {
    const line = document.createElement("div");
    line.className = "result-calm-line";
    line.style.left = `${pos[0]}%`;
    line.style.top = `${pos[1]}%`;
    line.style.width = `${22 + (i % 3) * 10}px`;
    line.style.animationDelay = `${i * 0.14}s`;
    line.style.transform = `rotate(${(i % 2 === 0 ? -12 : 10)}deg)`;
    decoLayer.appendChild(line);
  });
}

function setBadMode(value = THRESHOLD) {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Hmm...”";
  resultBottom.textContent = "maybe slow your mind down a little.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 14], [42, 80],
    [62, 24], [74, 68], [88, 18], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const zig = document.createElement("div");
    zig.className = "result-zig";
    zig.style.left = `${pos[0]}%`;
    zig.style.top = `${pos[1]}%`;
    zig.style.width = `${20 + (i % 3) * 8}px`;
    zig.style.height = `${20 + (i % 3) * 8}px`;
    zig.style.animationDelay = `${i * 0.16}s`;

    zig.innerHTML = `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M2 2 L10 9 L6 9 L14 18" />
      </svg>
    `;

    decoLayer.appendChild(zig);
  });
}