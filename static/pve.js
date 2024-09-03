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
        hSymbol = document.querySelector('input[name="symbol"]:checked')?.nextSibling.nodeValue.trim(); // selected
        // the checked input with name "symbol"and  then get and trim the text content of its next (sibling )the elemnts following itt 

        cSymbol = hSymbol === 'X' ? 'O' : 'X'; // set computer symbol as the other one
        firstMove = document.querySelector('input[name="player"]:checked')?.nextSibling.nodeValue.trim();

        if (!hSymbol || !firstMove) {
            alert('Please select both symbol and who starts first!');
            return; //for now this is a convention
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
            console.log('Initial game state:', data);// i added this to show up on the console so i can see the data and how to handle it bcs i keep getting two answers from the server
            board = data.board;
            updateBoardUI(board);
            gameInProgress = true;

            if (firstMove === 'computer') {
                handleComputerMove(); 
            } else {
                cellContainer.style.display = 'grid';
                statusText.textContent = 'Your turn!';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function handleComputerMove() { //function to handle the pc move
        fetch('/pve/play', { //even for the first move i sent the data to the second endpoint since teh fetched data from the server is kinda of the initial state of the board if the computer is first ofc
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
                const winnerSymbol = data.winner === 1 ? cSymbol : (data.winner === -1 ? hSymbol : null); //not sure of this one since i read the game's python code and it seems liek it interperts 1 as pc sign and -1 as huiman sign
                if (winnerSymbol) {
                    statusText.textContent = winnerSymbol === hSymbol ? 'Congratulations! You won!' : 'Game Over! Computer won!';
                } else {
                    statusText.textContent = 'Game Over! It\'s a draw!';
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
        if (!gameInProgress) return; // prevent moves if the game is not in progress

        const row = Math.floor(index / 3); //to find indexes according to 2D array in js 
        const col = index % 3;

        if (board[row][col] !== 0) return; // cell already taken

        board[row][col] = (hSymbol === 'X') ? -1 : 1; // Update board with player's move

        fetch('/pve/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ board, h_symbol: hSymbol, c_symbol: cSymbol })
        })
        .then(response => response.json())
        .then(data => {
            console.log('After player move:', data);
            board = data.board;
            updateBoardUI(board);

            if (data.game_over) {
                const winnerSymbol = data.winner === 1 ? cSymbol : (data.winner === -1 ? hSymbol : null);
                if (winnerSymbol) {
                    statusText.textContent = winnerSymbol === hSymbol ? 'Congratulations! You won!' : 'Game Over! Computer won!';
                } else {
                    statusText.textContent = 'Game Over! It\'s a draw!';
                }
                restartBtn.style.display = 'block';
                gameInProgress = false; 
            } else {
                handleComputerMove(); // proceed with computer move
            }
        })
        .catch(error => console.error('Error:', error));
    }


    //restarst btn
    restartBtn.addEventListener('click', () => {
        board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        updateBoardUI(board);
        cellContainer.style.display = 'grid';
        statusText.textContent = 'Your turn!';
        restartBtn.style.display = 'none';
        gameInProgress = true; 
    });

    function updateBoardUI(board) {
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElem = document.querySelector(`.cell[cellIndex="${rowIndex * 3 + cellIndex}"]`);
                cellElem.textContent = cell === 1 ? cSymbol : cell === -1 ? hSymbol : '';
                cellElem.classList.toggle('taken', cell !== 0);
                // selecting the correct cell element corresponding to the current row and column in a 3x3 grid using the cellIndex (according to js matrix)

            });
        });
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => makeMove(index));
    });
});



 

