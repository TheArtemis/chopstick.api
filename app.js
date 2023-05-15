/* const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false })); */

/*          TEST FOR IMPLEMENTIG GAME LOGIC             */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* ---------------------------------------------------- */

const board = [[1, 1], [1, 1]]

/* 
    Player 0 is the one who starts the game
    Player 1 is the opponent
*/

let currentPlayer = 0;

function isHandDead(hand) {
    return hand == 0;
}

function hasPlayerLost(player) {
    return board[player][0] === 0 && board[player][1] === 0;
}

function isGameOver() {
    return hasPlayerLost(0) || hasPlayerLost(1);
}

function getWinner() {
    if (hasPlayerLost(0))
        return 1;
    else if (hasPlayerLost(1))
        return 0;
    else
        return -1;
}


/* 
    Move Types:
       - ATTACK
       - SPLIT      
*/

function makeAttack(player, hand1, opponent, hand2) { //player->hand1 attacks opponent->hand2   
    

    sum = board[player][hand1] + board[opponent][hand2];

    if (sum == 5)
        board[opponent][hand2] = 0;
    else if(sum > 5)
        board[opponent][hand2] = sum - 5;
    else
        board[opponent][hand2] = sum;
}

function makeSplit(player, hand1){ 

    if(board[player][hand1] % 2 !== 0)
        return false;

    const hand2 = (hand1 + 1) % 2;

    if(board[player][hand2] !== 0)
        return false;

    const half = board[player][hand1] / 2;

    board[player][hand2] = half;
    board[player][hand1] = half;
}

function makeMove(player, hand1, hand2, type){  
    
    if(isHandDead(board[player][hand1]))
        return false;        

    if(type.toUpperCase() == "ATTACK"){
        const opponent = (player + 1) % 2; // 0 -> 1, 1 -> 0
        if(isHandDead(board[opponent][hand2]))
            return false;
        makeAttack(player, hand1, opponent, hand2);  
    }
          

    else if(type.toUpperCase() == "SPLIT")
        makeSplit(player, hand1, hand2);    
    
    else 
        return false;    

    return true;
}

var turn = 0;
function commandLineGameLoop() {    
        
        console.log(`--- Is Player ${currentPlayer} turn. Turns played: ${turn}`);

        console.log(`Player 0: Left hand:${board[0][0]}, Right hand:${board[0][1]}`);
        console.log(`Player 1: Left hand:${board[1][0]}, Right hand:${board[1][1]}`);

        // Get player's move        
        
        rl.question(`Player ${currentPlayer}, enter your move: (ATTACK/SPLIT) (HAND1) (HAND2): `, (answer) => {
            const [type, hand1, hand2] = answer.split(' ');            

            if(!makeMove(currentPlayer, parseInt(hand1), parseInt(hand2), type)){
                console.log("Invalid move, try again\n");                              
            }

            else {
                if(isGameOver()){
                    console.log(`Player ${getWinner()} won!`);
                    return;
                }

                turn++;               
                currentPlayer = (currentPlayer + 1) % 2;
            }          
            
            commandLineGameLoop();
            
        });   
}

commandLineGameLoop();

/* const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); */
