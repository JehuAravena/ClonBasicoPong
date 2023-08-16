
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

let iniciado = false;
let intro = new Audio("intro.ogg");
let loop = new Audio("loop.ogg");
let reproducido = false;

const pong = {
  width: canvas.width,
  height: canvas.height,
  paddleWidth: 10,
  paddleHeight: 100,
  paddleSpeed: 4,
  ballSpeed: 1,
  player1: {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 0,
  },
  player2: {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 0,
  },
  ball: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 1,
    dy: 1,
  },
  score: {
    player1: 0,
    player2: 0,
  },
};

function draw() {

  context.fillStyle = "#000";
  context.fillRect(0, 0, pong.width, pong.height);


  context.fillStyle = "#fff";
  context.fillRect(
    pong.player1.x,
    pong.player1.y,
    pong.player1.width,
    pong.player1.height
  );

  context.fillRect(
    pong.player2.x,
    pong.player2.y,
    pong.player2.width,
    pong.player2.height
  );


  context.beginPath();
  context.arc(pong.ball.x, pong.ball.y, pong.ball.radius, 0, Math.PI * 2);
  context.fillStyle = "#fff";
  context.fill();
  context.closePath();


  context.setLineDash([5, 15]);
  context.moveTo(pong.width / 2, 0);
  context.lineTo(pong.width / 2, pong.height);
  context.strokeStyle = "#fff";
  context.stroke();


  context.font = "40px Arial";
  context.fillText(pong.score.player1, pong.width / 4, 50);
  context.fillText(pong.score.player2, (pong.width / 4) * 3, 50);


  if (!iniciado) {
    context.fillStyle = "#fff";
    context.font = "20px Arial";
    context.fillText(
      "Haz clic para iniciar",
      pong.width / 2 - 90,
      pong.height / 2 - 20
    );
  }
}

function update() {

  if (!iniciado) {
    return;
  }


  pong.player1.y += pong.player1.dy;
  pong.player2.y += pong.player2.dy;


  pong.ball.x += pong.ball.dx;
  pong.ball.y += pong.ball.dy;


  pong.ball.dx *= 1.0005;
  pong.ball.dy *= 1.0005;


  if (
    pong.ball.y + pong.ball.radius > pong.height ||
    pong.ball.y - pong.ball.radius < 0
  ) {
    pong.ball.dy *= -1;
  }


  if (
    pong.ball.x + pong.ball.radius > pong.player2.x &&
    pong.ball.y > pong.player2.y &&
    pong.ball.y < pong.player2.y + pong.player2.height
  ) {
    pong.ball.dx *= -1;
  }

  if (
    pong.ball.x - pong.ball.radius < pong.player1.x + pong.player1.width &&
    pong.ball.y > pong.player1.y &&
    pong.ball.y < pong.player1.y + pong.player1.height
  ) {
    pong.ball.dx *= -1;
  }


  if (pong.ball.x - pong.ball.radius < 0) {
    pong.score.player2++;
    resetBall();
  } else if (pong.ball.x + pong.ball.radius > pong.width) {
  
    pong.score.player1++;
    resetBall();
  }
}

function resetBall() {
  pong.ball.x = pong.width / 2;
  pong.ball.y = pong.height / 2;
  pong.ball.dx = pong.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
  pong.ball.dy = pong.ballSpeed * (Math.random() > 0.5 ? 1 : -1);

  loop.playbackRate = 1.0;
}

function handleKeyDown(event) {
  if (event.key === "ArrowUp") {
    pong.player2.dy = -pong.paddleSpeed;
  } else if (event.key === "ArrowDown") {
    pong.player2.dy = pong.paddleSpeed;
  } else if (event.key === "w") {
    pong.player1.dy = -pong.paddleSpeed;
  } else if (event.key === "s") {
    pong.player1.dy = pong.paddleSpeed;
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    pong.player2.dy = 0;
  } else if (event.key === "w" || event.key === "s") {
    pong.player1.dy = 0;
  }
}

function handleClick() {
  if (!iniciado) {
    iniciado = true;
  }

  if (!reproducido) {
  
    intro.volume = document.getElementById("volume-slider").value / 100;
    intro.play();
  
    intro.onended = function () {
    
      loop.loop = true;
      loop.volume = document.getElementById("volume-slider").value / 100;
      loop.play();
    };
  
    let incremento = 0.007;
    let max = 10.0;
    let intervalo = setInterval(function () {
    
      loop.playbackRate += incremento;
    
      if (loop.playbackRate >= max) {
        clearInterval(intervalo);
      }
    }, 1000);
  
    loop.addEventListener("timeupdate", function () {
      let tiempo = loop.currentTime;
      let duracion = loop.duration;
      let umbral = 0;
      if (duracion - tiempo <= umbral) {
        loop.currentTime = 0;
      }
    });
  
    reproducido = true;
  }
}

function gameLoop() {
  draw();
  update();
}

let slider = document.getElementById("volume-slider");
slider.addEventListener("input", function () {

  intro.volume = slider.value / 100;
  loop.volume = slider.value / 100;
});

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
canvas.addEventListener("click", handleClick);

setInterval(gameLoop, 1000 / 120);
