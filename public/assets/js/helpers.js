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
//remove childs from html element
function removeChildsByParentId(id) {
  var e = document.getElementById(id);
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }
}
