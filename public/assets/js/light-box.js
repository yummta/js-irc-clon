const $openLightBox = document.getElementById('js-open-lb')
const $closeLightBox = document.getElementById('js-close-lb')
const $lightbox = document.getElementById('js-light-box')

$openLightBox.addEventListener("click", openLightBox)
$closeLightBox.addEventListener("click", closeLightBox)

function openLightBox() {
  event.preventDefault()
  $lightbox.classList.add("-active")
}

function closeLightBox() {
  event.preventDefault()
  $lightbox.classList.remove("-active")
}
