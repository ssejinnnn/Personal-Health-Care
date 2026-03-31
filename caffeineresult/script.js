const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("caffeineRecord"));

  if (!saved || typeof saved.cups !== "number") {
    setBadMode();
    return;
  }

  if (saved.cups <= 2.5) {
    setGoodMode();
  } else {
    setBadMode();
  }
});

function setGoodMode() {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“Yesss!”";
  resultBottom.textContent = "perfect little boost.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 76], [18, 18], [34, 10], [42, 70],
    [66, 18], [74, 34], [82, 82], [92, 20], [90, 74]
  ];

  positions.forEach((pos, i) => {
    const bean = document.createElement("div");
    bean.className = "result-bean";
    bean.style.left = `${pos[0]}%`;
    bean.style.top = `${pos[1]}%`;
    bean.style.animationDelay = `${i * 0.18}s`;
    decoLayer.appendChild(bean);
  });
}

function setBadMode() {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Hmm...”";
  resultBottom.textContent = "maybe ease up on the caffeine.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 16], [44, 78],
    [62, 26], [74, 70], [88, 20], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const drop = document.createElement("div");
    drop.className = "result-drop";
    drop.style.left = `${pos[0]}%`;
    drop.style.top = `${pos[1]}%`;
    drop.style.height = `${42 + (i % 3) * 10}px`;
    drop.style.animationDelay = `${i * 0.16}s`;
    decoLayer.appendChild(drop);
  });
}