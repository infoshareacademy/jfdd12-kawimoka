const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
let numOfEnemies = 15
const FREE_SPACE = (40*SIZE - (SIZE + (numOfEnemies - 1) * SPACE_BETWEEN)) / 2 
const WIDTH = 900
const HEIGHT = 600
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 100
const BOY_HEIGHT = 100

let boy = {
  x: WIDTH / 2,
  y: (HEIGHT - BOY_HEIGHT) - 50,
}

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', `${30 * SIZE}px`)
canvas.setAttribute('height', `${20 * SIZE}px`)
const ctx = canvas.getContext('2d')

let isPlaying = false;

function animate() {
  drawGame()
  requestAnimationFrame(animate)
}
animate();
drawPlayButton();


function drawGame(){
  drawBackground();
  drawBurgers();
  drawBoy();
  drawPauzaButton();
  
  
  if(!isPlaying){
    drawInstruction();
  }
}


function drawBurgers() {

  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE , SIZE + SPACE_BETWEEN, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE + 2 * SPACE_BETWEEN, SIZE, SIZE)
  }

}

function drawBackground() {
  drawImage('game-images/background.png', 0, 0, WIDTH, HEIGHT)
}

function drawInstruction() {
  drawImage('game-images/instruction.png', (WIDTH - INSTRUCTION_WIDTH)/2, (HEIGHT - INSTRUCTION_HEIGHT)/2, INSTRUCTION_WIDTH, INSTRUCTION_HEIGHT)
}

function drawBoy() {
  drawImage('game-images/boy-skinny.png', boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT)
}

function drawPlayButton() {
  var playButton = document.createElement('button')
  playButton.innerHTML = "PLAY"
  playButton.classList.add("play-button-style");
  playButton.addEventListener('click', function(){
    isPlaying = !isPlaying;
    playButton.classList.add("no-button");
  })
  body.append(playButton);
}

function drawPauzaButton() {
  var pauzaButton = document.createElement('button')
  pauzaButton.innerHTML = "PAUZA | HOW TO PLAY"
  pauzaButton.classList.add("pauza-button-style");
  body.append(pauzaButton)
}


function drawBurger (x, y, width, height) {
  drawImage('game-images/burger.png',x, y, width, height)
}

function drawImage (imageUrl, x, y, w, h, onload = () => {}) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function() {
    ctx.drawImage(image, x, y, w, h)
    onload()
  }
  return image
}
