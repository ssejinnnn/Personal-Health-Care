const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("nameInput");
const heightInput = document.getElementById("heightInput");
const weightInput = document.getElementById("weightInput");
const birthdayInput = document.getElementById("birthdayInput");
const photoInput = document.getElementById("photoInput");

const heroHello = document.getElementById("heroHello");
const previewName = document.getElementById("previewName");
const previewHeight = document.getElementById("previewHeight");
const previewWeight = document.getElementById("previewWeight");
const previewBirthday = document.getElementById("previewBirthday");
const profilePreview = document.getElementById("profilePreview");
const photoPlaceholder = document.getElementById("photoPlaceholder");

window.addEventListener("DOMContentLoaded", () => {
  const savedProfile = JSON.parse(localStorage.getItem("healthUserProfile"));

  if (savedProfile) {
    nameInput.value = savedProfile.name || "";
    heightInput.value = savedProfile.height || "";
    weightInput.value = savedProfile.weight || "";
    birthdayInput.value = savedProfile.birthday || "";

    updateHello(savedProfile.name || "");
    updatePreview(savedProfile);

    if (savedProfile.photo) {
      showPhoto(savedProfile.photo);
    }
  } else {
    updateHello("");
    updatePreview({});
  }
});

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  updateHello(name);
  previewName.textContent = name || "Your name";
});

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const name = nameInput.value.trim();
    updateHello(name);
  }
});

heightInput.addEventListener("input", () => {
  previewHeight.textContent = heightInput.value
    ? `Height: ${heightInput.value} cm`
    : "Height: —";
});

weightInput.addEventListener("input", () => {
  previewWeight.textContent = weightInput.value
    ? `Weight: ${weightInput.value} kg`
    : "Weight: —";
});

birthdayInput.addEventListener("input", () => {
  previewBirthday.textContent = birthdayInput.value
    ? `Birthday: ${birthdayInput.value}`
    : "Birthday: —";
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    showPhoto(e.target.result);
  };
  reader.readAsDataURL(file);
});

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    heroHello.textContent = "HELLO";
    nameInput.focus();
    return;
  }

  const savedProfile = {
    name: name,
    height: heightInput.value.trim(),
    weight: weightInput.value.trim(),
    birthday: birthdayInput.value,
    photo: profilePreview.classList.contains("hidden") ? "" : profilePreview.src
  };

  localStorage.setItem("healthUserProfile", JSON.stringify(savedProfile));
  updateHello(name);
  updatePreview(savedProfile);
});

function updateHello(name) {
  heroHello.textContent = name ? `HELLO ${name}` : "HELLO";
}

function updatePreview(profile) {
  previewName.textContent = profile.name || "Your name";
  previewHeight.textContent = profile.height
    ? `Height: ${profile.height} cm`
    : "Height: —";
  previewWeight.textContent = profile.weight
    ? `Weight: ${profile.weight} kg`
    : "Weight: —";
  previewBirthday.textContent = profile.birthday
    ? `Birthday: ${profile.birthday}`
    : "Birthday: —";
}

function showPhoto(src) {
  profilePreview.src = src;
  profilePreview.classList.remove("hidden");
  photoPlaceholder.classList.add("hidden");
}