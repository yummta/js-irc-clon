//scroll at the end of the windows chat
function lastLine() {
  document.getElementById(
    "js-messages-list"
  ).scrollTop = document.getElementById("js-messages-list").scrollHeight;
}
