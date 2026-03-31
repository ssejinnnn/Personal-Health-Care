const resultPage = document.getElementById("resultPage");
const decoLayer = document.getElementById("decoLayer");
const resultTop = document.getElementById("resultTop");
const resultBottom = document.getElementById("resultBottom");

window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("exerciseRecord"));

  if (!saved || typeof saved.minutes !== "number") {
    setBadMode();
    return;
  }

  if (saved.minutes >= 60) {
    setGoodMode();
  } else {
    setBadMode();
  }
});

function setGoodMode() {
  resultPage.classList.remove("bad");
  resultPage.classList.add("good");

  resultTop.textContent = "“Yesss!”";
  resultBottom.textContent = "You moved so well today.Ꙭ̮”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 76], [18, 18], [34, 10], [42, 70],
    [66, 18], [74, 34], [82, 82], [92, 20], [90, 74]
  ];

  positions.forEach((pos, i) => {
    const spark = document.createElement("div");
    spark.className = "result-spark";
    spark.textContent = "✦";
    spark.style.left = `${pos[0]}%`;
    spark.style.top = `${pos[1]}%`;
    spark.style.fontSize = `${34 + (i % 3) * 12}px`;
    spark.style.animationDelay = `${i * 0.18}s`;
    decoLayer.appendChild(spark);
  });
}

function setBadMode() {
  resultPage.classList.remove("good");
  resultPage.classList.add("bad");

  resultTop.textContent = "“Hmm...”";
  resultBottom.textContent = "maybe move a little more.Ꙭ̯”";

  decoLayer.innerHTML = "";

  const positions = [
    [10, 18], [18, 72], [34, 16], [44, 78],
    [62, 26], [74, 70], [88, 20], [92, 78]
  ];

  positions.forEach((pos, i) => {
    const dumbbell = document.createElement("div");
    dumbbell.className = "result-dumbbell";
    dumbbell.style.left = `${pos[0]}%`;
    dumbbell.style.top = `${pos[1]}%`;
    dumbbell.style.width = `${46 + (i % 3) * 10}px`;
    dumbbell.style.height = `${30 + (i % 3) * 8}px`;
    dumbbell.style.animationDelay = `${i * 0.16}s`;

    dumbbell.innerHTML = `
      <div class="mini-bar"></div>
      <div class="mini-plate left-1"></div>
      <div class="mini-plate left-2"></div>
      <div class="mini-plate right-1"></div>
      <div class="mini-plate right-2"></div>
    `;

    decoLayer.appendChild(dumbbell);
  });
}