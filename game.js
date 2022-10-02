const canvas = document.querySelector(".canvas");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");
const blockSize = canvas.height / 20;





class TetrominoShape {
    constructor(tetrominoColor,shape,shapeName) {
        this.tetrominoColor = tetrominoColor;
        this.shape = shape;
        this.shapeName = shapeName;
    }
}
class TetrominoPosition {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

const blockList = [
    new TetrominoShape("orange",[
        [0,0,1],
        [1,1,1],
        [0,0,0],

    ],""),
    new TetrominoShape("violet", [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],""),

    new TetrominoShape("green",[
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],""),

    new TetrominoShape("rgb(27, 74, 168)",[
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],""),

    new TetrominoShape("rgb(0, 153, 204)",[
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],"line"),

    new TetrominoShape("yellow",[
        [1,1],
        [1,1],
        [0,0]
    ], "square"),

    new TetrominoShape("red",[
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],""),
]

let lineRotationCounter = 0;
let oneCounter = 0;
let randomIndex = Math.round(Math.random() * 6);
let tempRandomIndex;
let currentTetromino;
let tetrominoPartCoordinate;


function drawBoard() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
            ctx.strokeStyle = "rgb(194, 194, 214)";
            ctx.strokeRect(blockSize * i, blockSize * j,blockSize,blockSize);
        }
    }
}

function drawTetromino() {
    let temp;
    let tempCond = true
    if (currentTetromino !== undefined) temp = tetrominoPartCoordinate;

    tetrominoPartCoordinate = [];

    tempRandomIndex = randomIndex;
    currentTetromino = blockList[randomIndex];
    ctx.fillStyle = currentTetromino.tetrominoColor;

    for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[0].length; j++) {
            if (currentTetromino.shape[i][j] === 1) {
                tetrominoPartCoordinate.push(
                    new TetrominoPosition(j * blockSize + canvas.width / 2,i * blockSize)
                )


                if (i > 0  ) {
                    tetrominoPartCoordinate[oneCounter].y -= blockSize
                }
                if (temp !== undefined) tetrominoPartCoordinate[oneCounter].y = temp[oneCounter].y + blockSize;
                ctx.fillRect(j * blockSize + canvas.width / 2,i * blockSize + tetrominoPartCoordinate[oneCounter].y,blockSize,blockSize);
                oneCounter++;
            }
        }
        tempCond = false
    }
    oneCounter = 0;
}


function rotate() {
    const size = currentTetromino.shape.length;
    const layer_count = size / 2;


    if (lineRotationCounter < 1) {
        for (let i = 0; i < layer_count; i++) {
            const first = i;
            const last = size - first - 1;

            for (let j = first; j < last; j++) {
                const offset = j - first;

                const top = currentTetromino.shape[first][j];
                const right_side = currentTetromino.shape[j][last];
                const bottom = currentTetromino.shape[last][last - offset];
                const leftSide = currentTetromino.shape[last - offset][first];

                currentTetromino.shape[first][j] = leftSide;
                currentTetromino.shape[j][last] = top;
                currentTetromino.shape[last][last - offset] = right_side;
                currentTetromino.shape[last - offset][first] = bottom;

            }
        }
        if (currentTetromino.shapeName === "line") lineRotationCounter++;
    } else {
        if (lineRotationCounter === 1) {
            lineRotationCounter = 0;
            currentTetromino.shape = [[1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]]
        }
    }



}
function draw() {

    setInterval(()=> {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        drawTetromino();

        drawBoard();

    },500)


}


function startGame() {
    // rotation listener
    document.addEventListener("keydown", (e) => {
        if (e.key === "w" && currentTetromino.shapeName !== "square") rotate(1)

    })


    drawBoard();
    draw();
}

startGame();

/*
function drawTetromino() {
    tetrominoPartCoordinate = [];

    randomIndex = Math.round(Math.random() * 6);

    tempRandomIndex = randomIndex;
    currentTetromino = blockList[randomIndex];

    for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[0].length; j++) {
            if (currentTetromino.shape[i][j] === 1 || currentTetromino.shape[i][j] === 2) {
                tetrominoPartCoordinate.push(new TetrominoPart(
                    blockSize * j + canvas.width / 2 - blockSize,blockSize * i
                ));
            }
        }
    }
}*/







/*
// used in the rotate function
function respawnRotatedTetromino() {
    let oneCounterForBoard = 0;
    let toLoop = true;

    for (let i = 0; i < currentTetromino.shape.length && toLoop; i++) {
        for (let j = currentTetromino.shape[0].length - 1; j >= 0; j--) {
            if (currentTetromino.shape[i][j] === 1) {
                oneCounterForBoard++;
            } else if (currentTetromino.shape[i][j] === 2) {
                rotationPoint = oneCounterForBoard + 1;
                toLoop = false;
                break;
            }
        }
    }

    oneCounterForBoard = 0;


    for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[0].length; j++) {
            if (currentTetromino.shape[i][j] === 1 && oneCounterForBoard + 1 !== rotationPoint) {
                    tetrominoPartCoordinate[oneCounterForBoard].x =  blockSize * j + tetrominoPartCoordinate[rotationPoint].x;
                    tetrominoPartCoordinate[oneCounterForBoard].y =  blockSize * i + tetrominoPartCoordinate[rotationPoint].y;
                    oneCounterForBoard++;
            }
            else {

            }
        }
    }

}

function drawTetromino() {

    //randomIndex = Math.round(Math.random() * 6);
    randomIndex = 2

    tempRandomIndex = randomIndex;
    currentTetromino = blockList[randomIndex];

    for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[0].length; j++) {
            if (currentTetromino.shape[i][j] === 1) {
                tetrisMap[i][j + 4] = 1
                tetrominoPartCoordinate.push(
                    new TetrominoTablePosition(i,j + 4)
                )
            }
        }
    }
}


function drawTetromino() {
    ctx.fillStyle = currentTetromino.tetrominoColor;

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (tetrisMap[i][j] !== 0) {
                ctx.fillRect(blockSize * j,blockSize * i,blockSize,blockSize)
            }
        }
    }
}

function addGravity() {
    tetrisMap = createMap();

    tetrominoPartCoordinate.forEach(element => {
        element.row += 1;
        tetrisMap[element.row][element.column] = 1;

    })

}
*/