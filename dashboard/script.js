const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardSub = document.getElementById("dashboardSub");

window.addEventListener("DOMContentLoaded", () => {
  const savedProfile = JSON.parse(localStorage.getItem("healthUserProfile"));

  if (savedProfile && savedProfile.name) {
    dashboardTitle.textContent = `${savedProfile.name}'s Health Control`;
    dashboardSub.textContent = `Welcome back, ${savedProfile.name}. Keep track of your daily balance, routines, and small changes.`;
  }
});

const cards = document.querySelectorAll(".health-card");

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-8px) rotate(-1deg)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});