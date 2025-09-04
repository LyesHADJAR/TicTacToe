document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const cellContainer = document.getElementById('cellContainer');
    const statusText = document.getElementById('statusText');
    const cells = document.querySelectorAll('.cell');
    const text = document.getElementById('dialogueContainer');


    let hSymbol = '';
    let cSymbol = '';
    let firstMove = '';
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let gameInProgress = false;
    let gameStats = {
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0
    };

    // Load stats from localStorage
    const savedStats = localStorage.getItem('tictactoeStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }

    startBtn.addEventListener('click', () => {
        startBtn.textContent = 'Starting...';
        startBtn.disabled = true;
        text.style.display = 'none';
        const symbolInput = document.querySelector('input[name="symbol"]:checked');
        hSymbol = symbolInput ? symbolInput.nextSibling.textContent.trim() : '';
        cSymbol = hSymbol === 'X' ? 'O' : 'X';
        const firstMoveElement = document.querySelector('input[name="player"]:checked');
        if (firstMoveElement) {
            firstMove = firstMoveElement.id === 'pc' ? 'computer' : 'player';
        } else {
            firstMove = '';
        }


        if (!hSymbol || !firstMove) {
            alert('Please select both symbol and who starts first!');
            return;
        }

        fetch('/pve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ h_symbol: hSymbol, c_symbol: cSymbol, first_move: firstMove })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('Initial game state:', data);
            board = data.board;
            updateBoardUI(board);
            gameInProgress = true;

            cellContainer.style.display = 'grid';

            if (firstMove === 'computer') {
                statusText.textContent = 'Computer Played'; 
            } else {
                statusText.textContent = 'Your turn!';
            }
            startBtn.textContent = 'Play again';
            startBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error starting game:', error);
            statusText.textContent = `Error: ${error.message}`;
            text.style.display = 'block';
            startBtn.textContent = 'Start Game';
            startBtn.disabled = false;
        });
    });

    function handleComputerMove() {
        fetch('/pve/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board, h_symbol: hSymbol, c_symbol: cSymbol })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('Computer move:', data);
            board = data.board;
            updateBoardUI(board);
            
            if (data.game_over) {
                updateGameStats(data.winner, hSymbol);
                if (data.winner === cSymbol) {
                    statusText.textContent = `Game Over! Computer won! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                } else if (data.winner === hSymbol) {
                    statusText.textContent = `Congratulations! You won! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                } else if (data.winner === null) {
                    statusText.textContent = `Game Over! It's a draw! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                }
                restartBtn.style.display = 'block';
                gameInProgress = false;
            } else {
                statusText.textContent = 'Your turn!';
            }
        })
        .catch(error => {
            console.error('Error making computer move:', error);
            statusText.textContent = `Error: ${error.message}`;
        });
    }
    function makeMove(index) {
        console.log("Before player's move (initial board state):", JSON.parse(JSON.stringify(board))); // deep copy to ensure no mutation
    
        if (!gameInProgress) return;
    
        const row = Math.floor(index / 3);
        const col = index % 3;
    
        if (board[row][col] !== 0) return;
    
       
        board[row][col] = -1;
    
        updateBoardUI(board);
        //before sending to the server
        console.log("Before sending player's move to server:", JSON.parse(JSON.stringify(board)));
    
        fetch('/pve/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board, h_symbol: hSymbol, c_symbol: cSymbol })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log('After player move (server response - computer move):', data);

            board = data.board;
            updateBoardUI(board);
    
            if (data.game_over) {
                updateGameStats(data.winner, hSymbol);
                if (data.winner === cSymbol) {
                    statusText.textContent = `Game Over! Computer won! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                } else if (data.winner === hSymbol) {
                    statusText.textContent = `Congratulations! You won! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                } else if (data.winner === null) {
                    statusText.textContent = `Game Over! It's a draw! (W:${gameStats.wins} L:${gameStats.losses} D:${gameStats.draws})`;
                }
                
                restartBtn.style.display = 'block';
                gameInProgress = false;
            } else {
                statusText.textContent = 'Your turn!';
            }
        })
        .catch(error => {
            console.error('Error making player move:', error);
            statusText.textContent = `Error: ${error.message}`;
            // Revert the move on error
            board[row][col] = 0;
            updateBoardUI(board);
        });
    }
    


    restartBtn.addEventListener('click', () => {
        window.location.href = '/pve';
    });

    function updateGameStats(winner, humanSymbol) {
        gameStats.totalGames++;
        if (winner === humanSymbol) {
            gameStats.wins++;
        } else if (winner === cSymbol) {
            gameStats.losses++;
        } else {
            gameStats.draws++;
        }
        localStorage.setItem('tictactoeStats', JSON.stringify(gameStats));
    }

    function updateBoardUI(board) {
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElem = document.querySelector(`.cell[cellIndex="${rowIndex * 3 + cellIndex}"]`);
                cellElem.textContent = cell === 1 ? cSymbol : cell === -1 ? hSymbol : '';
                cellElem.classList.toggle('taken', cell !== 0);
            });
        });
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => makeMove(index));
    });
});

 

