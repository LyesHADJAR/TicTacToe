let Xsym = document.getElementById('Xsym');
let Osym = document.getElementById('Osym');
let player = document.getElementById('player');
let pc = document.getElementById('pc');

let first_player;
let chosen_move;

//  event listeners to determine who plays first and which symbol is chosen
player.addEventListener('click', () => {
    first_player = 'human';
});

pc.addEventListener('click', () => {
    first_player = 'computer';
});

Xsym.addEventListener('click', () => {
    chosen_move = 'X';
});

Osym.addEventListener('click', () => {
    chosen_move = 'O';
});


let startBtn = document.getElementById('startBtn');
let cellContainer = document.getElementById('cellContainer');
let restartBtn = document.getElementById('restartBtn');
let dialogueContainer = document.getElementById('dialogueContainer');


startBtn.addEventListener('click', () => {
    // assign values to variables based on user selections
    let Human_symbol;
    let Pc_symbol;
    let first_Move;

    if (first_player === 'human' && chosen_move === 'X') {
        Human_symbol = 'X';
        Pc_symbol = 'O';
        first_Move = 'human';
    } else if (first_player === 'human' && chosen_move === 'O') {
        Human_symbol = 'O';
        Pc_symbol = 'X';
        first_Move = 'human';
    } else if (first_player === 'computer' && chosen_move === 'X') {
        Human_symbol = 'X';
        Pc_symbol = 'O';
        first_Move = 'computer';
    } else if (first_player === 'computer' && chosen_move === 'O') {
        Human_symbol = 'O';
        Pc_symbol = 'X';
        first_Move = 'computer';
    }
    const data = {
        h_symbol: Human_symbol,
        c_symbol: Pc_symbol,
        first_move: first_Move
    };

    // end data to the server
    fetch('/pve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()) 
    .then(data => {
        // Handling the response data 
        console.log(data);
        cellContainer.style.display = 'grid';
        restartBtn.style.display = 'block';
        dialogueContainer.style.display = 'none';

        
        const board = data.board;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.querySelector(`[cellIndex="${i * 3 + j}"]`);
                cell.textContent = board[i][j] === 0 ? '' : board[i][j] === 1 ? 'X' : 'O';
            }
        }
        if (data.game_over) {
            const statusText = document.getElementById('statusText');
            if (data.winner) {
                statusText.textContent = `Game Over! Winner: ${data.winner}`;
            } else {
                statusText.textContent = "Game Over! It's a draw!";
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



