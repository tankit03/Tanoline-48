import Grid from "../src/Grid.js";
import Tile from "../src/tile.js";
import { resetScore } from "../src/score.js"; // Import the resetScore function

const gameboard = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');

let grid;
let score = 0;

// Function to reset the game
export function restartGame() {
    // Reset score
    resetScore();

    // Clear the game board
    gameboard.innerHTML = '';

    // Reinitialize grid and add two random tiles
    grid = new Grid(gameboard);
    grid.randomEmptyCell().tile = new Tile(gameboard);
    grid.randomEmptyCell().tile = new Tile(gameboard);

    // Reattach the input listener
    setupInput();
}

grid = new Grid(gameboard);
grid.randomEmptyCell().tile = new Tile(gameboard);
grid.randomEmptyCell().tile = new Tile(gameboard);
restartButton.addEventListener('click', restartGame);
setupInput();

console.log("this is right: ", grid.cellsByColumn);


// Update score display
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

export function setupInput() {
    window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if(!canMoveUp()){
                setupInput();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()){
                setupInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()){
                setupInput();
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if(!canMoveRight()){
                setupInput();
                return;
            }
            await moveRight();
            break;
        default:
            setupInput();
            break;
    }

    grid.cells.forEach(cell => cell.mergeTiles());

    const newTile = new Tile(gameboard);
    grid.randomEmptyCell().tile = newTile;

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        console.log("Game Over");
        newTile.waitForTransition(true).then(() => {
            showGameOverModal(); // Show the stylized modal
        });
        return;
    }

    setupInput();
}

function showGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    modal.classList.remove('hidden'); // Show the modal

    const retryButton = document.getElementById('retry-button');
    retryButton.addEventListener('click', () => {
        modal.classList.add('hidden'); // Hide the modal
        restartGame(); // Restart the game
    });
}

function moveUp(){
    const columns = Object.values(grid.cellsByColumn);
    return slideTiles(columns); 
}

function moveDown(){
    const columns = Object.values(grid.cellsByColumn).map(column => [...column].reverse());
    return slideTiles(columns);
}

function moveLeft(){
    const columns = Object.values(grid.cellsByRow);
    return slideTiles(columns);
}
function moveRight(){
    const columns = Object.values(grid.cellsByRow).map(row => [...row].reverse());
    return slideTiles(columns);
}

function slideTiles(cells) {
    return Promise.all(
    Object.values(cells).flatMap(group => {
        const promises = [];
        for(let i = 1; i < group.length; i++){
            const cell = group[i];
            if(cell.tile == null) continue;
            let lastValidCell;
            for (let j = i - 1; j >= 0; j--){
                const moveToCell = group[j];
                if(!moveToCell.canAccept(cell.tile)) break;
                lastValidCell = moveToCell;
            }
            if(lastValidCell != null){
                promises.push(cell.tile.waitForTransition());
                if(lastValidCell.tile != null){
                    lastValidCell.mergeTile = cell.tile;
                } else {
                    lastValidCell.tile = cell.tile;
                }
                cell.tile = null;
            }
        }
        return promises;
    }));
}

function canMoveUp(){
    return canMove(Object.values(grid.cellsByColumn));
}

function canMoveDown(){
    return canMove(Object.values(grid.cellsByColumn).map(column => [...column].reverse()));
}

function canMoveLeft(){
    return canMove(Object.values(grid.cellsByRow));
}

function canMoveRight(){
    return canMove(Object.values(grid.cellsByRow).map(row => [...row].reverse()));
}

function canMove(cells){
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false;
            if(cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        })
    })
}