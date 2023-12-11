//HTML Elementos que vamos a utilizar
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSing = document.getElementById('gameOver');

//Game setting
const boardSize = 10;
const gameSpeed = 300;
const squareTypes ={
    emptySquare:0,
    snakeSquare:1,
    foodSquare:2
};

//mapear direcciones
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

//variables del juego que se van a ir modificando
let snake;
let score;
let direction;
let boardSquares;
let emptySquares; //guardamos los valores vacíos para generar la comida
let moveInterval;

const drawSnake = () =>{
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}
//Rellena cada cuadrado del tablero
//@params
//square: posición del cuadrado,
//type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    const [row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'emptySquare'){
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1){
            emptySquares.splice(emptySquares.indexOf(square), 1);

        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length -1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');
    
    if(newSquare < 0 ||
       newSquare > boardSize * boardSize ||
       (direction ==='ArrowRight' && column == 0)||
       (direction ==='ArrowLeft' && column == 9 ||
       boardSquares[row][column] === squareTypes.snakeSquare) ){

        //si sucede algunos de los casos anteriores
        gameOver();
       } else {
        snake.push(newSquare);
            if(boardSquares[row][column] === squareTypes.foodSquare){
                addFood();
            }else {
                const emptySquare = snake.shift();
                drawSquare(emptySquare, 'emptySquare');
            }
            drawSnake();
       }

}

const addFood = () => {
    score++;
    updateScore();
    createRamdonFood();
}

const gameOver = () => {
    gameOverSing.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}
const directionEvent = key => {
    switch(key.code){
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;


    }

}
// Agrega manejo de clic para los botones
document.getElementById('arriba').addEventListener('click', () => setDirection('ArrowUp'));
document.getElementById('abajo').addEventListener('click', () => setDirection('ArrowDown'));
document.getElementById('izquierda').addEventListener('click', () => setDirection('ArrowLeft'));
document.getElementById('derecha').addEventListener('click', () => setDirection('ArrowRight'));



const createRamdonFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}



//Función para crear un tablero nuevo

const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })

}

const setGame = ()=>{
    snake = ['00','01','02','03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), ()=> new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard(); //función que crea un tablero nuevo
}

const startGame = () => {
    setGame(); 
    gameOverSing.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore ();
    createRamdonFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
    
}

startButton.addEventListener('click', startGame);