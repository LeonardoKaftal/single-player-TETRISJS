const canvas = document.querySelector(".canvas");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");
const blockSize = canvas.height / 20;

let player =  {
    pos: {x: 4 * blockSize, y: 0},
    matrix: undefined,
    color: undefined
}
let arena = createArena();
let gameOver = false;
let rightPressed = false;
let leftPressed = false;
let downPressed = false;

const keydown = e => {
    switch(e.key) {
        case "a":
            rightPressed = true;
            break;
        case "d":
            leftPressed = true;
            break;
        case "s":
            downPressed = true;
            break;
    }
}

const keyup = e => {
    switch(e.key) {
        case "a":
            rightPressed = false;
            break;
        case "d":
            leftPressed = false;
            break;
        case "s":
            downPressed = false;
            break;
    }
}

function createArena() {
    const temp = [];

    for (let i = 0; i < 20; i++) {
        temp.push([])
        for (let j = 0; j < 10; j++) {
            temp[i][j] = 0;
        }
    }
    return temp
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        y++;

        rowCount *= 2;
    }
}


function spawnTetromino() {
    class TetrominoShape {
        constructor(shape,shapeName) {
            this.shape = shape;
            this.shapeName = shapeName;
        }
    }

    const randomIndex = Math.ceil(Math.random() * 6);
    console.log(randomIndex)
    const blockList = [

        new TetrominoShape([
            [0,0,1],
            [1,1,1],
            [0,0,0],

        ],""),
        new TetrominoShape([
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],""),

        new TetrominoShape([
            [0,2,2],
            [2,2,0],
            [0,0,0]
        ],""),

        new TetrominoShape([
            [3,0,0],
            [3,3,3],
            [0,0,0]
        ],""),

        new TetrominoShape([
            [4,4,4,4],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],"line"),

        new TetrominoShape([
            [5,5],
            [5,5],
            [0,0]
        ], "square"),

        new TetrominoShape([
            [6,6,0],
            [0,6,6],
            [0,0,0]
        ],""),
    ]
    return blockList[randomIndex].shape;
}


const colors = [

    '#FF8E0D',
    '#F538FF',
    '#0DFF72',
    '#1056ef',
    '#0DC2FF',
    '#FFE138',
    '#FF0D72',
];

player.matrix = spawnTetromino();

function drawBoard() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
            ctx.strokeStyle = "rgb(194, 194, 214)";
            ctx.strokeRect(i * blockSize, j * blockSize,blockSize,blockSize);
        }
    }
}

function drawPlacedTetromino() {
    for (let i = 0; i < arena.length; i++) {
        for (let j = 0; j < arena[0].length; j++) {
            if (arena[i][j] !== 0) {
                ctx.fillStyle = colors[arena[i][j]];
                ctx.fillRect(j * blockSize,i * blockSize,blockSize,blockSize);
            }
        }
    }
}

function drawTetromino(matrix, offset) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] !== 0) {
                ctx.fillStyle = colors[matrix[i][j]];
                ctx.fillRect(j * blockSize + offset.x,
                            i * blockSize + offset.y,blockSize,blockSize);
            }
        }
    }
}

function addGravity() {
    player.pos.y += blockSize;
    dropCounter = 0;

    if (collide() || player.pos.y >= canvas.height) {
        console.log("true1")
        player.pos.y -= blockSize;
        stopTetromino();
    }
}


function mergeArena() {
    try {
        player.matrix.forEach((row,y) => {
            row.forEach((value,x) => {
                if (value !== 0) {
                    arena[y + player.pos.y / blockSize][x + player.pos.x / blockSize] = value;
                }
            })
        })
    } catch (e) {
        console.log(e);
        gameOver = true;
    }

}

function collide() {
    const [m,o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if ((m[y][x] !== 0) && (arena[y + o.y / blockSize]
            && arena[y + o.y / blockSize][x + o.x / blockSize]) !== 0) {
                return true
            }
        }
    }
}

function move() {
    if (rightPressed) player.pos.x -= blockSize;
    if (leftPressed) player.pos.x += blockSize;
    if (collide()) {
        if (rightPressed) player.pos.x += blockSize;
        else if (leftPressed) player.pos.x -= blockSize;
    }

}

function moveDown() {
    if (downPressed) {
        if (collide() || player.pos.y >= canvas.height) {
            player.pos.y -= blockSize;
            stopTetromino();

        }
        else  {
            player.pos.y  += blockSize;
            if (collide()) {
                player.pos.y -= blockSize;
                stopTetromino();
            }
        }
    }
}

function stopTetromino() {
    mergeArena();
    player.pos.y = 0;
    player.pos.x = blockSize * 4;
    player.matrix = spawnTetromino();
}

function rotate(dir) {
    for (let i = 0; i < player.matrix.length; i++) {
        for (let j = 0; j < i; j++) {
            [player.matrix[i][j], player.matrix[j][i]] =
            [player.matrix[j][i], player.matrix[i][j]]
        }
    }

    if (dir > 0) player.matrix.forEach(row => row.reverse());
    else player.matrix.reverse();

    if (collide()) {
        if (player.pos.x < 0) player.pos.x = 0;
        else player.pos.x = canvas.width / 2 + blockSize * 2;
    }
}

document.addEventListener("keydown",e => {
    keydown(e);
    if (e.key === "w") rotate(1);
    else if (e.key === "q") rotate(-1);
})

document.addEventListener("keyup", e => {
    keyup(e)
})

document.addEventListener("keyup", e => {
    if (e.key === "h") {
        while (!collide() && player.pos.y / blockSize < 18) {
            player.pos.y += blockSize;
            if (collide()) {
                player.pos.y -= blockSize;
                stopTetromino();
                break;
            }
        }
    }
})

// fps variable
let dropCounter = 0;
let dropIntervall = 500;
let lastTimeDrop = 0;
let fpsInterval, startTime, now, then, elapsed;


function draw(time = 0) {
    const deltaDropTime = time - lastTimeDrop;
    lastTimeDrop = time;

    dropCounter += deltaDropTime;

    // tetromino gravity
    if (dropCounter > dropIntervall) {
        addGravity();
    }

    if (!gameOver) {
        requestAnimationFrame(draw);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            arenaSweep()
            drawPlacedTetromino();
            drawTetromino(player.matrix,player.pos);
            drawBoard();
            moveDown();
            move();
        }
    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER",canvas.width / 2 - blockSize / 2, canvas.height / 2);
    }
}

fpsInterval = 1000 / 20;
then = Date.now();
startTime = then;
draw();
