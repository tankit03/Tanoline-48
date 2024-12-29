let score = 0;

export function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

export function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

