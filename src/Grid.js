const GRID_SIZE = 4; // 4x4 grid
const CELL_SIZE = 15; // Each cell size in vmin
const CELL_GAP = 1; // Gap between cells in vmin

import { updateScore } from "../src/score.js";
import { restartGame } from "../src/script.js";



export default class Grid {

    #cells

    constructor(gridElement) {

        console.log('Grid created');
        gridElement.style.setProperty('--grid-size', GRID_SIZE);
        gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
        gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement, 
                index % GRID_SIZE, 
                Math.floor(index / GRID_SIZE)
            );
        });
        console.log(this.cells);
    }

    get cellsByRow(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell
            return cellGrid;
        }, {});
    }

    get cells() {
        return this.#cells;
    }

    get cellsByColumn(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell
            return cellGrid;
        }, {});
    }
    

    get #emptyCells(){
        return this.#cells.filter(cell => cell.tile == null)

    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]
    }
}

class Cell {

    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    get tile() {
        return this.#tile
    }

    set tile(value) {
        this.#tile = value
        if(value == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile(){
        return this.#mergeTile
    }

    set mergeTile(value){
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    canAccept(tile){
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value == tile.value)
        )
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        const mergedValue = this.tile.value + this.mergeTile.value;
        updateScore(mergedValue); // Update the score
        console.log(`Merged tiles with value: ${mergedValue}`); // Debug log
        this.tile.value = mergedValue;
        this.mergeTile.remove();
        this.mergeTile = null;

        if (mergedValue === 1024) {
            showWinModal();
        }
    }
}

function showWinModal() {
    const winModal = document.getElementById('win-modal');
    const winImage = document.getElementById('win-image'); // Image element in the modal
    const images = [
        '/images/win1.png',
        '/images/win2.png',
        '/images/win3.png',
        '/images/win4.png',
        '/images/win5.png',
        '/images/win6.png',
        '/images/win7.png'
    ]; // Array of image paths
    let currentImageIndex = 0;

    // Show the modal
    winModal.classList.remove('hidden');

    // Set interval to change images every second
    const intervalId = setInterval(() => {
        winImage.src = images[currentImageIndex];
        winImage.alt = `Celebration Image ${currentImageIndex + 1}`;
        currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle through images
    }, 1000);

    // Add event listener for the continue button
    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', () => {
        winModal.classList.add('hidden'); // Hide the modal
        clearInterval(intervalId); // Stop the interval
        restartGame(); // Reset the game
    });
}



function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
