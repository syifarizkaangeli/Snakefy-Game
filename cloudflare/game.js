"use strict";

// ==============================
// SNAKEFY GAME
// ==============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const levelElement = document.getElementById("level");
const speedElement = document.getElementById("speed");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const finalScoreElement = document.getElementById("finalScore");
const newRecordElement = document.getElementById("newRecord");


// ==============================
// CONFIG
// ==============================

const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;

const INITIAL_SPEED = 150;
const MIN_SPEED = 55;

let gameTimer = null;
let gameRunning = false;

let snake = [];
let food = {};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let level = 1;
let currentSpeed = INITIAL_SPEED;

let highScore = Number(localStorage.getItem("snakefyHighScore")) || 0;

highScoreElement.textContent = highScore;


// ==============================
// START GAME
// ==============================

function startGame() {
    clearTimeout(gameTimer);

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;
    level = 1;
    currentSpeed = INITIAL_SPEED;

    scoreElement.textContent = score;
    levelElement.textContent = level;
    speedElement.textContent = "1x";

    newRecordElement.classList.add("hidden");

    generateFood();

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    gameRunning = true;

    draw();

    gameLoop();
}


// ==============================
// GAME LOOP
// ==============================

function gameLoop() {
    if (!gameRunning) {
        return;
    }

    gameTimer = setTimeout(() => {
        update();
        draw();

        if (gameRunning) {
            gameLoop();
        }
    }, currentSpeed);
}


// ==============================
// UPDATE
// ==============================

function update() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
    ) {
        endGame();
        return;
    }

    // Self collision
    for (let i = 0; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Food collision
    if (
        head.x === food.x &&
        head.y === food.y
    ) {
        eatFood();
    } else {
        snake.pop();
    }
}


// ==============================
// FOOD
// ==============================

function generateFood() {
    let validPosition = false;

    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        validPosition = !snake.some(
            segment =>
                segment.x === food.x &&
                segment.y === food.y
        );
    }
}

function eatFood() {
    score += 10;

    scoreElement.textContent = score;

    // Every 50 points = new level
    const newLevel = Math.floor(score / 50) + 1;

    if (newLevel !== level) {
        level = newLevel;

        currentSpeed = Math.max(
            MIN_SPEED,
            INITIAL_SPEED - ((level - 1) * 12)
        );

        levelElement.textContent = level;

        const speedMultiplier =
            (INITIAL_SPEED / currentSpeed).toFixed(1);

        speedElement.textContent =
            `${speedMultiplier}x`;
    }

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;

        localStorage.setItem(
            "snakefyHighScore",
            highScore
        );
    }

    generateFood();
}


// ==============================
// DRAW
// ==============================

function draw() {
    // Background
    ctx.fillStyle = "#020202";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();
    drawFood();
    drawSnake();
}


// ==============================
// GRID
// ==============================

function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; i++) {
        const position = i * CELL_SIZE;

        ctx.beginPath();
        ctx.moveTo(position, 0);
        ctx.lineTo(position, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, position);
        ctx.lineTo(canvas.width, position);
        ctx.stroke();
    }
}


// ==============================
// SNAKE
// ==============================

function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;

        const padding = 2;

        ctx.fillStyle =
            index === 0
                ? "#00ff88"
                : "#00c96b";

        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = index === 0 ? 10 : 5;

        roundRect(
            ctx,
            x + padding,
            y + padding,
            CELL_SIZE - padding * 2,
            CELL_SIZE - padding * 2,
            4
        );

        ctx.fill();
    });

    ctx.shadowBlur = 0;

    // Eyes
    drawSnakeEyes();
}

function drawSnakeEyes() {
    const head = snake[0];

    if (!head) {
        return;
    }

    const centerX =
        head.x * CELL_SIZE + CELL_SIZE / 2;

    const centerY =
        head.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.fillStyle = "#001a0d";

    const eyeOffset = 4;

    let eyes = [];

    if (direction.x === 1) {
        eyes = [
            [centerX + eyeOffset, centerY - 4],
            [centerX + eyeOffset, centerY + 4]
        ];
    } else if (direction.x === -1) {
        eyes = [
            [centerX - eyeOffset, centerY - 4],
            [centerX - eyeOffset, centerY + 4]
        ];
    } else if (direction.y === -1) {
        eyes = [
            [centerX - 4, centerY - eyeOffset],
            [centerX + 4, centerY - eyeOffset]
        ];
    } else {
        eyes = [
            [centerX - 4, centerY + eyeOffset],
            [centerX + 4, centerY + eyeOffset]
        ];
    }

    eyes.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fill();
    });
}


// ==============================
// FOOD
// ==============================

function drawFood() {
    const centerX =
        food.x * CELL_SIZE + CELL_SIZE / 2;

    const centerY =
        food.y * CELL_SIZE + CELL_SIZE / 2;

    const pulse =
        Math.sin(Date.now() / 150) * 1.2;

    ctx.save();

    ctx.shadowColor = "#ff3b3b";
    ctx.shadowBlur = 15;

    ctx.fillStyle = "#ff3b3b";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE * 0.27 + pulse,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    // Leaf
    ctx.fillStyle = "#00ff88";

    ctx.beginPath();

    ctx.ellipse(
        centerX + 5,
        centerY - 7,
        3,
        5,
        -0.7,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==============================
// GAME OVER
// ==============================

function endGame() {
    gameRunning = false;

    clearTimeout(gameTimer);

    finalScoreElement.textContent = score;

    if (score >= highScore && score > 0) {
        newRecordElement.classList.remove("hidden");
    }

    gameOverScreen.classList.remove("hidden");
}


// ==============================
// DIRECTION
// ==============================

function changeDirection(x, y) {
    if (!gameRunning) {
        return;
    }

    // Prevent instant 180-degree turn
    if (
        x === -direction.x &&
        y === -direction.y
    ) {
        return;
    }

    nextDirection = { x, y };
}


// ==============================
// KEYBOARD
// ==============================

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (
        [
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
            "w",
            "a",
            "s",
            "d",
            " "
        ].includes(key)
    ) {
        event.preventDefault();
    }

    switch (key) {
        case "arrowup":
        case "w":
            changeDirection(0, -1);
            break;

        case "arrowdown":
        case "s":
            changeDirection(0, 1);
            break;

        case "arrowleft":
        case "a":
            changeDirection(-1, 0);
            break;

        case "arrowright":
        case "d":
            changeDirection(1, 0);
            break;

        case " ":
            if (!gameRunning) {
                startGame();
            }
            break;
    }
});


// ==============================
// MOBILE BUTTONS
// ==============================

document.querySelectorAll(".control").forEach(button => {
    button.addEventListener("click", () => {
        const directionName =
            button.dataset.direction;

        switch (directionName) {
            case "up":
                changeDirection(0, -1);
                break;

            case "down":
                changeDirection(0, 1);
                break;

            case "left":
                changeDirection(-1, 0);
                break;

            case "right":
                changeDirection(1, 0);
                break;
        }
    });
});


// ==============================
// TOUCH SWIPE
// ==============================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
    "touchstart",
    event => {
        const touch = event.changedTouches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    },
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    event => {
        const touch = event.changedTouches[0];

        const dx =
            touch.clientX - touchStartX;

        const dy =
            touch.clientY - touchStartY;

        const threshold = 25;

        if (
            Math.abs(dx) < threshold &&
            Math.abs(dy) < threshold
        ) {
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                changeDirection(1, 0);
            } else {
                changeDirection(-1, 0);
            }
        } else {
            if (dy > 0) {
                changeDirection(0, 1);
            } else {
                changeDirection(0, -1);
            }
        }
    },
    { passive: true }
);


// ==============================
// BUTTONS
// ==============================

startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);


// ==============================
// HELPERS
// ==============================

function roundRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {
    context.beginPath();

    context.moveTo(x + radius, y);

    context.lineTo(
        x + width - radius,
        y
    );

    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    context.lineTo(
        x + width,
        y + height - radius
    );

    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    context.lineTo(
        x + radius,
        y + height
    );

    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    context.lineTo(
        x,
        y + radius
    );

    context.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    context.closePath();
}


// ==============================
// INITIAL DRAW
// ==============================

draw();

