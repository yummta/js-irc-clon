//scroll at the end of the windows chat
function lastLine() {
  document.getElementById(
    "js-messages-list"
  ).scrollTop = document.getElementById("js-messages-list").scrollHeight;
}

//avoid weird characters
document.getElementById("js-input-user-message").onkeypress = function(e) {
  var chr = String.fromCharCode(e.which);
  if ("></".indexOf(chr) >= 0) return false;
};
