const wrapper = document.querySelector(".wrapper");
const signupHeader = document.querySelector(".signup header");
const loginHeader = document.querySelector(".login header");
const signUpAction = document.getElementById("signupAction");
const loginAction = document.getElementById("loginAction");
const signupName = document.querySelector(".signup-name");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const signupCheck = document.getElementById("signupCheck");
const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
const loginMessage = document.querySelector(".login-form-message");

loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

signUpAction.addEventListener("submit", (e) => {
  e.preventDefault();

  const signupDetails = {
    name: signupName.value,
    email: signupEmail.value,
    password: signupPassword.value,
  };

  resetForm();
  submitSignUpForm(signupDetails);
  console.log(signupDetails);
});
loginAction.addEventListener("submit", (e) => {
  e.preventDefault();

  const loginDetails = {
    email: loginEmail.value,
    password: loginPassword.value,
  };

  resetForm();
  submitLoginForm(loginDetails);
  console.log(loginDetails);
});

function resetForm() {
  signupName.value = "";
  signupEmail.value = "";
  signupPassword.value = "";
  signupCheck.checked = false;
  loginEmail.value = "";
  loginPassword.value = "";
}

async function submitSignUpForm(signupDetails) {
  try {
    const response = await fetch("http://localhost:4000/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(signupDetails),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      showSignupSuccessModal();
    }
  } catch (error) {
    console.error(error);
  }
}

async function submitLoginForm(loginDetails) {
  try {
    const response = await fetch("http://localhost:4000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      const token = data.token;
      localStorage.setItem("Profile", token);
      window.location.href = "loginSuccess.html";
    } else {
      loginMessage.textContent = data.message;
    }
  } catch (error) {
    console.error(error);
  }
}
// function to show modal

function showSignupSuccessModal() {
  var modal = document.getElementById("signupModal");
  var closeButton = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  closeButton.onclick = function () {
    modal.style.display = "none";
    wrapper.classList.add("active");
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
