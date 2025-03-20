const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.6;
const FLAP_STRENGTH = -10;
const SPAWN_RATE = 90;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 300;
let gameWidth = 800;
let gameHeight = 600;
let score = 0;
let gameSpeed = 2;

canvas.width = gameWidth;
canvas.height = gameHeight;

let bird = {
    x: 150,
    y: 200,
    radius: 20,
    velocity: 0,
    flap: function() {
        this.velocity = FLAP_STRENGTH;
    },
    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'purple';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    },
    update: function() {
        this.velocity += GRAVITY;
        this.y += this.velocity;

        // Prevent bird from going out of bounds
        if (this.y + this.radius > gameHeight) {
            this.y = gameHeight - this.radius;
            this.velocity = 0;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }
};

let pipes = [];
let weather = 'sunny';
let fireworks = [];
let isGameOver = false;

let startButton = document.getElementById('startBtn');
startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    gameSpeed = 2;
    isGameOver = false;
    pipes = [];
    weather = 'sunny';
    fireworks = [];
    bird.y = 200;
    bird.velocity = 0;

    startButton.style.display = 'none'; // Hide the start button after clicking it

    document.addEventListener('keydown', handleFlap);
    document.addEventListener('keyup', stopFlap);
    requestAnimationFrame(gameLoop);
}

function handleFlap(e) {
    if (e.code === 'Space') {
        bird.flap();
    }
}

function stopFlap(e) {
    if (e.code === 'Space') {
        bird.velocity = 0;
    }
}

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (gameHeight / 2)) + 50;
    pipes.push({
        x: gameWidth,
        y: pipeHeight,
        width: PIPE_WIDTH,
        height: gameHeight - pipeHeight - PIPE_SPACING
    });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= gameSpeed;

        // Remove pipes that go off-screen
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            score++;
            if (score % 10 === 0) {
                fireworks.push({x: pipes[i].x + pipes[i].width / 2, y: gameHeight / 2, radius: 5});
            }
            i--;
        }
    }

    // Spawn new pipes
    if (Math.random() < 1 / SPAWN_RATE) {
        createPipe();
    }
}

function drawWeather() {
    if (weather === 'sunny') {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(gameWidth - 100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
    } else if (weather === 'rain') {
        ctx.fillStyle = 'blue';
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(Math.random() * gameWidth, Math.random() * gameHeight, 2, 10);
        }
    } else if (weather === 'snow') {
        ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * gameWidth, Math.random() * gameHeight, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawFireworks() {
    for (let i = 0; i < fireworks.length; i++) {
        fireworks[i].radius += 0.2;
        ctx.beginPath();
        ctx.arc(fireworks[i].x, fireworks[i].y, fireworks[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
}

function changeWeather() {
    const weatherTypes = ['sunny', 'rain', 'snow'];
    weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
}

function gameLoop() {
    if (isGameOver) {
        return;
    }

    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // Change weather every 5 seconds
    if (Math.random() < 0.01) {
        changeWeather();
    }

    drawWeather();
    updatePipes();
    bird.update();
    bird.draw();
    drawScore();
    drawFireworks();

    // Check for collisions
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.y || bird.y + bird.radius > pipe.y + pipe.height)
        ) {
            isGameOver = true;
            alert('Game Over! Your score is ' + score); // Notify user when game is over
            startButton.style.display = 'block'; // Show the start button again
            return;
        }
    }

    // Increase game speed after every 10 points
    if (score % 10 === 0 && gameSpeed < 5) {
        gameSpeed += 0.01;
    }

    requestAnimationFrame(gameLoop);
}
