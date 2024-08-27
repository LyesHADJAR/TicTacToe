


let Xsym = document.getElementById('Xsym');
let Osym = document.getElementById('Osym');
let player = document.getElementById('player');
let pc = document.getElementById('pc');


let first_player ;
let chosen_move ;
//adding event listeners 


player.addEventListener('click' , ()=> {
    first_player = 'human';
})

pc.addEventListener('click' , ()=> {
    first_player = 'computer';
})


Xsym.addEventListener('click' , ()=> {
    chosen_move = 'X';
})
Osym.addEventListener('click' , ()=> {
    chosen_move = 'O';
})


//define some vars 

let Human_symbol;
let Pc_symbol;
let first_Move;

if(first_player == 'human' && chosen_move == 'X'){
    Human_symbol = 'X';
    Pc_symbol = 'O';
    first_Move = 'human';
}
if(first_player == 'human' && chosen_move == 'O'){
    Human_symbol = 'O';
    Pc_symbol = 'X';
    first_Move = 'human';
}
if(first_player == 'computer' && chosen_move == 'X'){
    Human_symbol = 'X';
    Pc_symbol = 'O';
    first_Move = 'computer';
}
if(first_player == 'computer' && chosen_move == 'O'){
    Human_symbol = 'O';
    Pc_symbol = 'X';
    first_Move = 'computer';
}

const data = {
    h_symbol: Human_symbol,         
    c_symbol: Pc_symbol,          
    first_move: first_Move  
};


document.getElementById('startGame').addEventListener('click', function() {
    window.location.href = 'pveGame.html';  
});

fetch('/pve', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data) 
})
.then(response => response.json()) // Parse the response JSON
.then(data => {
    //handleing the sent data (i need to see that dat format in teh consle but because of that one problem i can't)
    console.log(data);
})
.catch(error => {
  
    console.error('Error:', error);
});


//other fetch calls are pretyy similar but haven't implemnted them yet im still trying to figure why the page isnt shwowing up
