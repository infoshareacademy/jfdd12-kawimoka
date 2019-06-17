const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE/2
let numOfBurgers = 15
const WIDTH = 900
const HEIGHT = 600
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 100
const BOY_HEIGHT = 100
const FREE_SPACE = (WIDTH - (SIZE + (numOfBurgers - 1) * SPACE_BETWEEN)) / 2 

let boy = {
  x: WIDTH / 2,
  y: (HEIGHT - BOY_HEIGHT) - 50,
}

const body = document.querySelector('body')
const canvas = document.createElement('canvas')
body.append(canvas)

canvas.setAttribute('width', WIDTH)
canvas.setAttribute('height', HEIGHT)
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
  if(!isPlaying){
    drawInstruction();
  }
}


function drawBurgers() {

  for (let i = 0; i < numOfBurgers; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfBurgers; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE , SIZE + SPACE_BETWEEN, SIZE, SIZE)
  }
  
  for (let i = 0; i < numOfBurgers; i++) {
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
  var button = document.createElement('button')
  button.innerHTML = "PLAY"
  button.classList.add("button-style");
  button.addEventListener('click', function(){
    isPlaying = !isPlaying;
  })
  body.append(button);
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