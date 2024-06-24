const slider = document.getElementById("character-length");
const valueSlider = document.getElementById("slider-value");
const form = document.querySelector("form");
const elementPassword = document.getElementById("password");
const btnSubmit = document.getElementById("submit-button");
const elementStr = document.getElementById("strength");
const strBars = document.querySelectorAll(".strength-bar");
const btnCopy = document.querySelector(".copy-style svg");
const elementCopied = document.getElementById("copied");

// FUNCTIONS

function renderStrength(str) {
  for (bar of strBars) {
    bar.style.background = "#18171f";
    bar.style.border = "2px solid #e6e5ea";
  }

  const strLvs = ["TOO WEAK!", "WEAK", "MEDIUM", "STRONG", "IRON"];
  const strClr = ["#F64A4A", "#FB7C58", "#F8CD65", "#A4FFAF", "#0a26f4"];

  elementStr.textContent = strLvs[str - 1];

  for (let i = 0; i < str; i++) {
    strBars[i].style.background = strClr[str - 1];
    strBars[i].style.border = strClr[str - 1];
  }
}

function calculateStrength(data) {
  const checkedArray = [
    data["upper-case"],
    data["lower-case"],
    data["numbers"],
    data["symbols"],
  ];

  const count = checkedArray.reduce(function (total, currentValue) {
    return currentValue ? total + 1 : total;
  }, 0);

  let strength = 0;

  if (data["character-length"] <= 4) {
    strength = 1;
  } else if (data["character-length"] <= 12) {
    strength = count;
  } else {
    strength = 1 + count;
  }

  return strength;
}

function renderPassword(password) {
  elementPassword.classList.add("ready");
  elementPassword.textContent = password;
}

function generatePassword(passwordComb, passwordLength) {
  let password = "";
  const combinationLength = passwordComb.length;

  for (let i = 0; i < passwordLength; i++) {
    password += passwordComb.charAt(
      Math.floor(Math.random() * combinationLength)
    );
  }

  return password;
}

function generatePasswordCombination(data, combinations) {
  let passwordCombinations = "";

  if (data["upper-case"]) {
    passwordCombinations += combinations.upperCase;
  }
  if (data["lower-case"]) {
    passwordCombinations += combinations.lowerCase;
  }
  if (data["numbers"]) {
    passwordCombinations += combinations.numbers;
  }
  if (data["symbols"]) {
    passwordCombinations += combinations.symbols;
  }

  return passwordCombinations;
}

function handleError() {
  btnSubmit.classList.add("error");
}

function isValid(data) {
  return (
    data["upper-case"] ||
    data["lower-case"] ||
    data["numbers"] ||
    data["symbols"]
  );
}

function handleData(e) {
  const data = {};
  const fields = e.target.querySelectorAll("input");

  for (const field of fields) {
    if (field.type === "range") {
      data[field.name] = field.value;
    } else {
      data[field.name] = field.checked;
    }
  }

  return data;
}

function handleSubmit(e) {
  e.preventDefault();

  const combinations = {
    upperCase: "QWERTYUIOPASDFGHJKLZXCVBNM",
    lowerCase: "qwertyuiopasdfghjklzxcvbnm",
    numbers: "0123456789",
    symbols: "!@#$%&_-?:",
  };

  const formData = handleData(e);

  if (!isValid(formData)) {
    handleError();
    return;
  } else {
    btnSubmit.classList.remove("error");
  }

  const passwordCombination = generatePasswordCombination(
    formData,
    combinations
  );

  const password = generatePassword(
    passwordCombination,
    formData["character-length"]
  );

  renderPassword(password);

  btnCopy.addEventListener("click", () => handleCopy(password));

  const strength = calculateStrength(formData);

  renderStrength(strength);
}

// SLIDER FUNCTIONS

function renderSliderValue(e) {
  valueSlider.textContent = e.target.value;
}

function renderSlider(ele) {
  var value = ((ele.value - ele.min) / (ele.max - ele.min)) * 100;
  ele.style.background =
    "linear-gradient(to right, #a4ffaf 0%, #a4ffaf " +
    value +
    "%, #18171f " +
    value +
    "%, #18171f 100%)";
}

// COPY

function handleCopy(pass) {
  navigator.clipboard.writeText(pass);
  if (elementCopied.classList.value === "hidden") {
    elementCopied.classList.remove("hidden");
    setTimeout(() => {
      elementCopied.classList.add("hidden");
    }, 1000);
  }
}

// EXCUTION

form.addEventListener("submit", handleSubmit);

slider.addEventListener("input", function (e) {
  renderSliderValue(e);
  renderSlider(e.target);
});
