const $openMenu = document.getElementById('js-open-channels')
const $closeMenu = document.getElementById('js-close-channels')
const $channeList = document.getElementById('channel-list')

$openMenu.addEventListener("click", openMenu)
$closeMenu.addEventListener("click", closeMenu)

function openMenu() {
  $channeList.classList.add("-active")
}

function closeMenu() {
  $channeList.classList.remove("-active")
}
