const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("waterIntakeRecord"));

  if (!saved || typeof saved.percent !== "number") {
    setBadMode();
    return;
  }

  if (saved.percent >= 50) {
    setGoodMode(saved.percent);
  } else {
    setBadMode(saved.percent);
  }
});

function setGoodMode(percent = 0) {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  if (percent >= 85) {
    resultTop.textContent = "Amazing!";
    resultBottom.textContent = "You’re super hydrated!Ꙭ̮";
  } else {
    resultTop.textContent = "Yesss!";
    resultBottom.textContent = "You’re staying hydrated!Ꙭ̮";
  }

  decoLayer.innerHTML = "";

  const positions = [
    [8, 74], [16, 20], [32, 10], [44, 70],
    [67, 14], [74, 34], [82, 78], [92, 20], [90, 70]
  ];

  positions.forEach((pos, i) => {
    const flower = document.createElement("div");
    flower.className = "result-flower";
    flower.style.left = `${pos[0]}%`;
    flower.style.top = `${pos[1]}%`;

    const size = 44 + (i % 3) * 12;
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.style.animationDelay = `${i * 0.18}s`;

    decoLayer.appendChild(flower);
  });
}

function setBadMode(percent = 0) {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  if (percent >= 35) {
    resultTop.textContent = "Almost...";
    resultBottom.textContent = "Go drink a little more water.Ꙭ̯";
  } else {
    resultTop.textContent = "Hey...";
    resultBottom.textContent = "Go drink some water.Ꙭ̯";
  }

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 74], [36, 16], [45, 80],
    [63, 28], [76, 72], [89, 18], [94, 82]
  ];

  positions.forEach((pos, i) => {
    const drop = document.createElement("div");
    drop.className = "result-drop";
    drop.style.left = `${pos[0]}%`;
    drop.style.top = `${pos[1]}%`;

    const width = 34 + (i % 3) * 10;
    const height = 46 + (i % 3) * 12;
    drop.style.width = `${width}px`;
    drop.style.height = `${height}px`;
    drop.style.animationDelay = `${i * 0.16}s`;

    decoLayer.appendChild(drop);
  });
}