const qst = document.getElementById("question")
const submitBtn = document.getElementById("submit")

submitBtn.addEventListener('click' , ()=> {
    qst.textContent = "";
    document.getElementById('form').innerHTML = ""
    submitBtn.remove();
})



// function sendMove(cellIndex) {
    
//     var data = JSON.stringify({
//         h_symbol: 'X',
//         c_symbol: 'O',
//         depth: 9,
//         size: 3,
//         board: board
//     });

    
//     var xhr = new XMLHttpRequest();

    
//     xhr.open('POST', '/play', true);

    
//     xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    
//     xhr.onload = function () {
//         if (xhr.status >= 200 && xhr.status < 300) {
//             var response = JSON.parse(xhr.responseText);
//             console.log(response);
//             updateBoard(response);
//             checkGameStatus(); 
//         } else {
//             console.error('Request failed. Returned status of ' + xhr.status);
//         }
//     };

    
//     xhr.onerror = function () {
//         console.error('Request failed. Unable to reach the server.');
//     };

    
//     xhr.send(data);
// }