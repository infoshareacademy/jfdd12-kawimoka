let isTeamWasShown = false

window.addEventListener('scroll', function() {
  let yScrollPosition = window.pageYOffset
  let elementPosition = document.getElementById('team-nav').offsetTop
  let visualScreenHeight = window.innerHeight
  let activationOffset = 0.85
  let heightConditionForAnimate =
    yScrollPosition + activationOffset * visualScreenHeight >= elementPosition

  if (!isTeamWasShown && heightConditionForAnimate) {
    isTeamWasShown = true
    let arrayOfImages = document.querySelectorAll('.animated')
    arrayOfImages.forEach(imageEl => {
      imageEl.classList.toggle('hide-pictures')
      imageEl.classList.toggle('flipInX')
    })
  }
})

function topFunction() {
  document.documentElement.scrollTop = 0
}
