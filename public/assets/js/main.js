const $buttonLogin = document.getElementById("js-button-loggin");
const $inputUsername = document.getElementById("js-input-username");
const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");

$buttonLogin.addEventListener("click", login);

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    localStorage.setItem("username", username);
    console.log(`[Save username ${username} in localStorage]`);
  }
}

$buttonCreateChannel.addEventListener("click");

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    localStorage.setItem("username", username);
    console.log(`[Save username ${username} in localStorage]`);
  }
}
