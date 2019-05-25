const $inputUsername = document.getElementById("js-input-username");
const $buttonLogin = document.getElementById("js-button-loggin");
const socket = new WebSocket(socketUrl());

function socketUrl() {
  return location.hostname == "localhost"
    ? "ws://localhost:3000"
    : `ws://${location.hostname}:${location.port}`;
}

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    let newDataUser = {
      user: username,
      userChannels: ["general"],
      ircChannels: ["general"],
      activeChannel: "general",
      ircMessages: {
        general: {
          messages: []
        }
      }
    };
    localStorage.setItem("data", JSON.stringify(newDataUser));
    window.location.replace("/main");
  }
}

function isUser() {
  return !!localStorage.getItem("data");
}

function isInPath(param) {
  return window.location.pathname == param;
}

if (isUser()) {
  if (isInPath("/")) {
    window.location.replace("/main");
  }
} else {
  if (isInPath("/")) {
    $buttonLogin.addEventListener("click", login);
  } else {
    window.location.replace("/");
  }
}
