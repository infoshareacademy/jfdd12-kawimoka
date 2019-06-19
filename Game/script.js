const SIZE = 30
const SPACE_BETWEEN = SIZE + SIZE / 2
let numOfEnemies = 15
const FREE_SPACE = (40 * SIZE - (SIZE + (numOfEnemies - 1) * SPACE_BETWEEN)) / 2
const WIDTH = 900
const HEIGHT = 600
const INSTRUCTION_WIDTH = 300
const INSTRUCTION_HEIGHT = 300
const BOY_WIDTH = 100
const BOY_HEIGHT = 100
const PLAY_BUTTON_WIDTH = 50
const PLAY_BUTTON_HEIGHT = 50
const PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT = 0.15*HEIGHT
const PAUSE_BUTTON_WIDTH = 150
const PAUSE_BUTTON_HEIGHT = 32
const BROKUL_WIDTH = 70/2
const BROKUL_HEIGHT = 80/2
const GRAVITY = 15
let counter = 3;

let boy = {
  x: WIDTH / 2,
  y: (HEIGHT - BOY_HEIGHT) - 50
}
let apples = []

const body = document.querySelector("body");
const canvas = document.createElement("canvas");
body.append(canvas);

canvas.setAttribute("width", `${30 * SIZE}px`);
canvas.setAttribute("height", `${20 * SIZE}px`);
const ctx = canvas.getContext("2d");

function drawBurger(x, y, width, height, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
let isPlaying = false;
let isShooting = false;

var images;
addClickEventToCanvas();
loadAllImages().then(values => {
  images = values
  animate(0)
})

let lastTime = 0
let delta = 0
let elapsedTime = 0
let timeToGameStart = 5
function animate(time) {
  delta = time - lastTime
  drawGame()
  requestAnimationFrame(animate)
  lastTime = time
}

function doEverySecond(callback) {
  elapsedTime += delta
  if (elapsedTime > 1000) {
    elapsedTime = 0
    callback()
  }
}

let vegetables = [];
setInterval(() => {
  let vegetable = new Vegetable();
  vegetables = [...vegetables, vegetable];
}, 1000);

function drawGame() {
  drawBackground();
  drawBurgers();
  drawBoy();
  drawPauseButton();
  drawVegetables();
  // vegetablesInterval = setInterval(drawVegetable, 5000);
  drawCounter(timeToGameStart);
  movingBoy();

  apples.forEach(apple => {
    if(apple.y>0){
    apple.draw()
    apple.move()
   
  }
  
  })




  if (!isPlaying) {
    drawInstruction();
    drawPlayButton();
  } else {
    doEverySecond(() => {
      timeToGameStart = timeToGameStart === 0 ? 0 : timeToGameStart - 1
    })
  }

}

function addClickEventToCanvas() {
  canvas.addEventListener("click", function(event) {
    let relativeClickX = event.x - canvas.offsetLeft;
    let relativeClickY = event.y - canvas.offsetTop;

    if (!isPlaying) {
      if (checkIfclickOnPlayButton(relativeClickX, relativeClickY)) {
        isPlaying = true;
      }
    } else {
      if (checkIfclickOnPauseButton(relativeClickX,relativeClickY)) {
        isPlaying = false
        timeToGameStart = 5
      }
    }
  });
}

function loadImage (imageUrl) {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageUrl
    image.onload = function () {
      resolve(image)
    };
  });
}

function loadAllImages () {
  const imagesNames = ['background', 'instruction', 'burger', 'pause', 'play', 'boy-skinny', 'brokul','marchew']
  const imagesPaths = imagesNames.map(imageName => `game-images/${imageName}.png`)
  const imagesPromises = imagesPaths.map(imagePath => loadImage(imagePath))

  return Promise.all(imagesPromises).then(loadedImages => {
    const images = imagesNames.reduce((acc, imageName, index) => {
      const name = imageName.replace("-", "");
      return {
        ...acc,
        [name]: loadedImages[index]
      };
    }, {});

    return images;
  });
}

function checkIfclickOnPlayButton(relativeClickX, relativeClickY) {
  let maxPlayClickScopeX = (WIDTH + PLAY_BUTTON_WIDTH) / 2;
  let minPlayClickScopeX = (WIDTH - PLAY_BUTTON_WIDTH) / 2;
  let maxPlayClickScopeY =
    HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT + PLAY_BUTTON_HEIGHT;
  let minPlayClickScopeY = HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT;

  return (
    relativeClickX < maxPlayClickScopeX &&
    relativeClickX > minPlayClickScopeX &&
    relativeClickY < maxPlayClickScopeY &&
    relativeClickY > minPlayClickScopeY
  );
}

function checkIfclickOnPauseButton(relativeClickX, relativeClickY) {
  return (
    relativeClickX < PAUSE_BUTTON_WIDTH && relativeClickY < PAUSE_BUTTON_HEIGHT
  );
}

function drawBurgers() {
  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(i * SPACE_BETWEEN + FREE_SPACE, SIZE, SIZE, SIZE);
  }

  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(
      i * SPACE_BETWEEN + FREE_SPACE,
      SIZE + SPACE_BETWEEN,
      SIZE,
      SIZE
    );
  }

  for (let i = 0; i < numOfEnemies; i++) {
    drawBurger(
      i * SPACE_BETWEEN + FREE_SPACE,
      SIZE + 2 * SPACE_BETWEEN,
      SIZE,
      SIZE
    );
  }
}

function drawBackground() {
  ctx.drawImage(images.background, 0, 0, WIDTH, HEIGHT);
}


function movingBoy() {

  const moveRight = () => {
    if (WIDTH - BOY_WIDTH > boy.x) {
      boy.x = boy.x + 10;
    }
  };
  const moveLeft = () => {
    if (boy.x > 0) {
      boy.x = boy.x - 10;
    }
  };
  
  kd.RIGHT.down(function() {
    if (isPlaying === true && timeToGameStart === 0) {
    moveRight();
    }
  });
  
  kd.LEFT.down(function() {
    if (isPlaying === true && timeToGameStart === 0) {
    moveLeft();
    }
  });

}


// This update loop is the heartbeat of Keydrown
kd.run(function() {
  if (isPlaying === true && timeToGameStart ===0) {
  kd.tick();
  }
});

function drawInstruction() {
  ctx.drawImage(
    images.instruction,
    (WIDTH - INSTRUCTION_WIDTH) / 2,
    (HEIGHT - INSTRUCTION_HEIGHT) / 2,
    INSTRUCTION_WIDTH,
    INSTRUCTION_HEIGHT
  );
}

function drawBoy() {
  ctx.drawImage(images.boyskinny, boy.x, boy.y, BOY_WIDTH, BOY_HEIGHT);
}

function drawPlayButton() {
  ctx.drawImage(
    images.play,
    WIDTH / 2 - PLAY_BUTTON_WIDTH / 2,
    HEIGHT / 2 + PLAY_BUTTON_POSITION_ADJUSTMENT_PERCENT,
    PLAY_BUTTON_WIDTH,
    PLAY_BUTTON_HEIGHT
  );
}

function drawPauseButton() {
  ctx.drawImage(images.pause, 0, 0, PAUSE_BUTTON_WIDTH, PAUSE_BUTTON_HEIGHT);
}

function drawBurger(x, y, width, height) {
  ctx.drawImage(images.burger, x, y, width, height);
}


function drawCounter(value) {
  if (value === 0) {
    return
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '50px Arial'
  ctx.fillStyle = '#000'
  ctx.fillText(value, WIDTH / 2, HEIGHT / 2)
}


function drawImage(imageUrl, x, y, w, h, onload = () => { }) {
  const image = new Image()
  image.src = imageUrl
  image.onload = function () {
    ctx.drawImage(image, x, y, w, h)
    onload()
  }
  return image
}


window.addEventListener('keydown', spaceKeyCheck, false);

function spaceKeyCheck(s) {
  if (s.keyCode == 32) {
    shot()
    return true
  } 
}

function shot(){
  //console.log("bang bang")
  const boyClone = {...boy}
  const apple = new Apple(boyClone.x,boyClone.y)
  apples = [...apples, apple]
} 


function Apple (x,y){
this.x = x
this.y = y
}

Apple.prototype = {
draw: function(){
  ctx.drawImage(images.brokul, this.x + (BOY_WIDTH/2) -(BROKUL_WIDTH/2), this.y, BROKUL_WIDTH, BROKUL_HEIGHT) 
},
move: function(){
  this.y= this.y - GRAVITY;

}
}

function Vegetable() {
  this.x = Math.floor(Math.random() * 900 - 50);
  this.y = -30;
  const vegetables = [
    {
      name: "marchew",
      width: 30,
      height: 30
    },
    {
      name: "brokul",
      width: 50,
      height: 50}
  ];
 
  const randomIndex = Math.floor(Math.random() * vegetables.length);
  const vegetable = vegetables[randomIndex];
  this.image = images[vegetable.name];
  this.width = vegetable.width;
  this.height = vegetable.height;
}

Vegetable.prototype = {
  draw: function() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  },
  move: function() {
    this.y = this.y + 2;
  }
};

function drawVegetables() {
  if (isPlaying === true && timeToGameStart === 0) {
    vegetables.forEach(vegetable => {
      vegetable.draw();
      vegetable.move();
      listenToCollision(vegetable);
    });
  }
}

function listenToCollision(vegetable) {
  const checkHeight = vegetable.y + vegetable.height >= boy.y;
  const checkLeft = vegetable.x + vegetable.width >= boy.x;
  const checkRight = vegetable.x <= boy.x + boy.width;

  console.log({
    checkHeight,
    checkLeft,
    checkRight
  });
  if (checkHeight && checkLeft && checkRight) {
    console.log("boy caught veg");
  }
}
