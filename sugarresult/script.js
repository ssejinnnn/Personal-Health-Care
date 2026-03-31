const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

const THRESHOLD = 2.5; // 50% of max 5 candy

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("sugarRecord"));

  if (!saved || typeof saved.candy !== "number") {
    setGoodMode();
    return;
  }

  // 50% 이상이면 bad
  if (saved.candy >= THRESHOLD) {
    setBadMode(saved.candy);
  } else {
    setGoodMode(saved.candy);
  }
});

function setGoodMode(value = 0) {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“Nice!”";
  resultBottom.textContent = "you kept it light today.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 76], [18, 18], [34, 10], [42, 72],
    [66, 18], [74, 34], [82, 82], [92, 20], [90, 74]
  ];

  positions.forEach((pos, i) => {
    const candy = document.createElement("div");
    candy.className = "result-candy";
    candy.style.left = `${pos[0]}%`;
    candy.style.top = `${pos[1]}%`;
    candy.style.width = `${28 + (i % 3) * 8}px`;
    candy.style.height = `${28 + (i % 3) * 8}px`;
    candy.style.animationDelay = `${i * 0.18}s`;

    candy.innerHTML = `
      <div class="twist left"></div>
      <div class="candy-core"></div>
      <div class="twist right"></div>
    `;

    decoLayer.appendChild(candy);
  });
}

function setBadMode(value = THRESHOLD) {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Oops...”";
  resultBottom.textContent = "maybe a little less sugar next time.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 16], [44, 78],
    [62, 26], [74, 70], [88, 20], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const cube = document.createElement("div");
    cube.className = "result-cube";
    cube.style.left = `${pos[0]}%`;
    cube.style.top = `${pos[1]}%`;
    cube.style.width = `${26 + (i % 3) * 8}px`;
    cube.style.height = `${26 + (i % 3) * 8}px`;
    cube.style.animationDelay = `${i * 0.16}s`;

    decoLayer.appendChild(cube);
  });
}