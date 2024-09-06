document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const cellContainer = document.getElementById('cellContainer');
    const statusText = document.getElementById('statusText');
    const cells = document.querySelectorAll('.cell');

    let hSymbol = '';
    let cSymbol = '';
    let firstMove = '';
    let board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let gameInProgress = false;

    startBtn.addEventListener('click', () => {
        startBtn.textContent = 'Play again !';
        hSymbol = document.querySelector('input[name="symbol"]:checked')?.nextSibling.nodeValue.trim();
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
        .then(response => response.json())
        .then(data => {
            console.log('Initial game state:', data);
            board = data.board;
            updateBoardUI(board);
            gameInProgress = true;

            cellContainer.style.display = 'grid';

            if (firstMove === 'computer') {
                statusText.textContent = 'Computer is thinking...'; 
            } else {
                statusText.textContent = 'Your turn!';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function handleComputerMove() {
        fetch('/pve/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board, h_symbol: hSymbol, c_symbol: cSymbol })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Computer move:', data);
            board = data.board;
            updateBoardUI(board);
            
            if (data.game_over) {
                if (data.winner === true) {
                    statusText.textContent = `Game Over! Computer won!`;
                } else if (data.winner === null) {
                    statusText.textContent = `Game Over! It's a draw!`;
                } else if (data.winner === false) {
                    statusText.textContent = `Congratulations! You won!`;
                }
                restartBtn.style.display = 'block';
                gameInProgress = false;
            } else {
                statusText.textContent = 'Your turn!';
            }
        })
        .catch(error => console.error('Error:', error));
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
        .then(response => response.json())
        .then(data => {
            console.log('After player move (server response - computer move):', data);

            board = data.board;
            updateBoardUI(board);
    
            if (data.game_over) {

                if (data.winner === true) {
                    statusText.textContent = 'Game Over! Computer won!';
                } else if (data.winner === false) {
                    statusText.textContent = 'Congratulations! You won!';
                } else if (data.winner === null) {
                    statusText.textContent = `Game Over! It's a draw!`;
                }
                
                restartBtn.style.display = 'block';
                gameInProgress = false;
            } else {
                
                statusText.textContent = 'Your turn!';
            }
            
        })
        .catch(error => console.error('Error:', error));
    }
    


    restartBtn.addEventListener('click', () => {
        window.location.href = '/pve';
    });

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

 

