const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("sleepRecord"));

  if (!saved || typeof saved.hours !== "number") {
    setBadMode();
    return;
  }

  if (saved.hours >= 9) {
    setGoodMode();
  } else {
    setBadMode();
  }
});

function setGoodMode() {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“YAY!!”";
  resultBottom.textContent = "You slept so well tonight.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 76], [18, 18], [34, 6], [42, 70],
    [68, 16], [74, 36], [80, 82], [94, 20], [92, 74]
  ];

  positions.forEach((pos, i) => {
    const flower = document.createElement("div");
    flower.className = "result-flower";
    flower.style.left = `${pos[0]}%`;
    flower.style.top = `${pos[1]}%`;

    const size = 42 + (i % 3) * 12;
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.style.animationDelay = `${i * 0.18}s`;

    decoLayer.appendChild(flower);
  });
}

function setBadMode() {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Hmm...”";
  resultBottom.textContent = "maybe sleep a little more.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 16], [44, 78],
    [62, 26], [74, 70], [88, 20], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const moon = document.createElement("div");
    moon.className = "result-moon";
    moon.style.left = `${pos[0]}%`;
    moon.style.top = `${pos[1]}%`;

    const width = 34 + (i % 3) * 10;
    const height = 34 + (i % 3) * 10;
    moon.style.width = `${width}px`;
    moon.style.height = `${height}px`;
    moon.style.animationDelay = `${i * 0.16}s`;

    decoLayer.appendChild(moon);
  });
}