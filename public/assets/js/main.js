const $buttonLogin = document.getElementById("js-button-loggin")
const $inputUsername = document.getElementById("js-input-username")

$buttonLogin.addEventListener( "click", login )

function login() {
  event.preventDefault()
  const username = $inputUsername.value
  if ( username ) {
    localStorage.setItem("username", username);
    console.log(`[Save username ${username} in localStorage]`)
  }
}
