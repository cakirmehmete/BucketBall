function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('counter').style.display = 'block';
}

document.getElementById('play').onclick = startGame;
