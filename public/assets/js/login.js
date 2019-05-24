const $inputUsername = document.getElementById("js-input-username");
const $buttonLogin = document.getElementById("js-button-loggin");
const socket = new WebSocket("ws://localhost:3000");

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
<<<<<<< HEAD
  let newDataUser = {
    user: username,
    userChannels: ["general"],
    ircChannels: ["general"],
    ircMessages: {
      general: {
        messages: []
=======
  if (username) {
    let newDataUser = {
      user: username,
      userChannels: ["general"],
      ircChannels: ["general"],
      ircMessages: {
        general: {
          messages: []
        }
>>>>>>> af6547383febf1db8c7b23d2e46cb7aa11fedf27
      }
    }
    localStorage.setItem("data", JSON.stringify(newDataUser));
    window.location.replace("/main");
  };
}

<<<<<<< HEAD
  if (username) {
    localStorage.setItem("data", JSON.stringify(newDataUser));
    window.location.replace("/main");
  }
=======
function isUser() {
  return !!localStorage.getItem("data")
>>>>>>> af6547383febf1db8c7b23d2e46cb7aa11fedf27
}

function isInPath(param) {
  return window.location.pathname == param
}

if ( isUser() ) {
  if ( isInPath('/') ) {
    window.location.replace("/main")
  }
} else {
  if ( isInPath('/') ) {
    $buttonLogin.addEventListener("click", login);
  } else {
    window.location.replace("/")
  }
}