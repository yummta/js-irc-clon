const $inputUsername = document.getElementById("js-input-username");
const $buttonLogin = document.getElementById("js-button-loggin");

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    localStorage.setItem("username", username);
    window.location.replace("/main");
  }
}

if ( !localStorage.getItem("username") ) {
  if ( window.location.pathname !== "/" ) {
    window.location.replace("/");
  } else {
    $buttonLogin.addEventListener("click", login);
  }
} else {
  if ( window.location.pathname !== "/main" ) {
    console.log("eee")
    window.location.replace("/main");
  }
}