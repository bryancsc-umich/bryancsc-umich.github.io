var board = {
}
var players = {
}

var currPlayer = 1;
var selectedToken = null;
var tokenChoices = {
    s: 'Small',
    m: 'Medium',
    l: 'Large'
}

function init() {
    for (let i = 1; i <= 9; i++) {
        board[i] = {
            s: 0,
            m: 0,
            l: 0
        }
        document.getElementById(i).innerHTML='';
    }

    for (let i = 1; i <= 4; i++) {
        players[i] = {
            s: 3,
            m: 3,
            l: 3
        }
    }
    players[1].color = 'red';
    players[2].color = 'blue';
    players[3].color = 'green';
    players[4].color = 'purple';

    selectedToken = null;
    
    currPlayer = 4; // Wraps around to 1.
    nextTurn();
}

function onCellClick(elt) {
    console.log(elt);
    // setTokenChoicesVisible(false);
    let selectedCell = parseInt(elt.id, 10);
    if (board[selectedCell][selectedToken] !== 0) {
        showError("This cell already has a " + players[board[selectedCell][selectedToken]].color + "-colored " + tokenChoices[selectedToken] + " sized token!");
        return;
    }
    let newRing = document.createElement('div');
    if (selectedToken === 's') {
        newRing.classList.add("ring_small", "shadow-lg")
        newRing.style.background = players[currPlayer].color;
    } else if (selectedToken === 'm') {
        newRing.classList.add("ring_medium", "shadow")
    } else {
        newRing.classList.add("ring_large", "shadow-sm")
    }
    newRing.style.border = "10px solid " + players[currPlayer].color;

    document.getElementById(selectedCell).appendChild(newRing);
    board[selectedCell][selectedToken] = currPlayer;
    players[currPlayer][selectedToken] -= 1;
    let gameOver = verifyBoard(selectedCell, selectedToken);
    if (gameOver) {
        let winningAnnouncement = "Player " + players[currPlayer].color + " has won!";
        alert(winningAnnouncement)
        init();
        return;
    }
    nextTurn();
}

function nextTurn() {
    if (currPlayer === 4) {
        currPlayer = 1;
    }
    else {
        currPlayer += 1;
    }
    document.getElementById('turn').innerHTML = `Player <strong style=\"color: ${players[currPlayer].color}\">` + players[currPlayer].color + "'s</strong> turn."
    setTokenChoicesForPlayer(currPlayer);
}

function onTokenClick(elt) {
    if (elt.classList.contains('disabled')) {
        return;
    }

    document.getElementById('s').classList.remove('active');
    document.getElementById('m').classList.remove('active');
    document.getElementById('l').classList.remove('active');
    selectedToken = elt.id;
    elt.classList.add('active');
}

function setTokenChoicesForPlayer(playerID) {
    let defaultChosen = false;
    for (token in tokenChoices) {

        document.getElementById(token+'_label').innerText = tokenChoices[token] + " (" + players[playerID][token] + ")"
        
        // Reset all buttons.
        document.getElementById(token).classList.remove('active', 'disabled');

        // If player still has 0 of this token.
        if (players[playerID][token] === 0) {
            document.getElementById(token).classList.add('disabled');
        }
        
        // Default not selected yet.
        else if (players[playerID][token] > 0 && defaultChosen === false) {
            defaultChosen = true;
            selectedToken = token;
            document.getElementById(token).classList.add('active');
        }
    }
}

function showError(errMsg) {
    alert(errMsg);
}

function verifyBoard(selectedCell, selectedToken) {
    selectedCell = parseInt(selectedCell, 10);
    // Check if current cell has all current player's tokens.
    if (board[selectedCell].s === currPlayer && board[selectedCell].m === currPlayer && board[selectedCell].l === currPlayer) {
        return true;
    }

    // Check horizontal and vertical.
    let firstInRow = Math.floor((selectedCell-1)/3)*3 + 1;
    let firstInCol = ((selectedCell-1)%3)+1;

    // Horizontal.
    // Same token.
    if (board[firstInRow][selectedToken] === currPlayer && board[firstInRow+1][selectedToken] === currPlayer && board[firstInRow+2][selectedToken] === currPlayer) {
        return true;
    }

    // Decrease or increase.
    if (board[firstInRow+1]['m'] === currPlayer && ((board[firstInRow]['s'] === currPlayer && board[firstInRow+2]['l'] === currPlayer) || (board[firstInRow]['l'] === currPlayer && board[firstInRow+2]['s'] === currPlayer))) {
        return true;
    }

    // Vertical.
    // Same token.
    if (board[firstInCol][selectedToken] === currPlayer && board[firstInCol+3][selectedToken] === currPlayer && board[firstInCol+6][selectedToken] === currPlayer) {
        return true;
    }
    // Decrease or increase.
    if (board[firstInCol+3]['m'] === currPlayer && ( (board[firstInCol]['s'] === currPlayer && board[firstInCol+6]['l'] === currPlayer) ||  (board[firstInCol]['l'] === currPlayer && board[firstInCol+6]['s'] === currPlayer))) {
        return true;
    }

    // Diagonal.
    if ([1, 3, 5, 7, 9].includes(selectedCell)) {
        // Check diagonals.
        if ((board[1][selectedToken] === currPlayer && board[5][selectedToken] === currPlayer && board[9][selectedToken] === currPlayer) || (board[3][selectedToken] === currPlayer && board[5][selectedToken] === currPlayer && board[7][selectedToken] === currPlayer)) {
            return true;
        }

        // Decrease or increase.
        if (board[5]['m'] === currPlayer && ( (board[1]['s'] === currPlayer && board[9]['l'] === currPlayer) ||  (board[1]['l'] === currPlayer && board[9]['s'] === currPlayer))) {
            return true;
        }

        // Decrease or increase.
        if (board[5]['m'] === currPlayer && ( (board[3]['s'] === currPlayer && board[7]['l'] === currPlayer) ||  (board[3]['l'] === currPlayer && board[7]['s'] === currPlayer))) {
            return true;
        }
    }

    return false;
}

init();
console.log(board);