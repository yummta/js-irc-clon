const $inputUsername = document.getElementById("js-input-username");
const $buttonLogin = document.getElementById("js-button-loggin");
let socket = new WebSocket("ws://localhost:3000");

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  let new_data_user = {
    user: username,
    channel: ["general"],
    message: {
      general: {
        messages: []
      }
    }
  };

  if (username) {
    localStorage.setItem("data", JSON.stringify(new_data_user));
    window.location.replace("/main");
  }
}

if (typeof localStorage.getItem("data") == "object") {
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  } else {
    $buttonLogin.addEventListener("click", login);
  }
} else {
  if (window.location.pathname !== "/main") {
    window.location.replace("/main");
  }
}
