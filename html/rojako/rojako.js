var board = {
}
var players = {
}

var currPlayer = 1;
var selectedToken = null;

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

    currPlayer = 1;
    selectedToken = null;
    
    document.getElementById('turn').innerText = "Player " + players[currPlayer].color + "'s turn."
    setTokenChoicesForPlayer(currPlayer);
    // setTokenChoicesVisible(true);
}

function onCellClick(elt) {
    console.log(elt);
    // setTokenChoicesVisible(false);
    let selectedCell = parseInt(elt.id, 10);
    if (board[selectedCell][selectedToken] !== 0) {
        showError();
        return;
    }
    let newRing = document.createElement('div');
    console.log(selectedToken);
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
    document.getElementById('turn').innerText = "Player " + players[currPlayer].color + "'s turn."
    setTokenChoicesForPlayer(currPlayer);
    // setTokenChoicesVisible(true);
}

function onTokenClick(elt) {
    console.log("ID", elt.id);
    selectedToken = elt.id;
}

function setTokenChoicesVisible(flag) {
    if (flag) {
        document.getElementById('tokens').style.display = 'block';    
    } else {
        document.getElementById('tokens').style.display = 'none';
    }
}

function setTokenChoicesForPlayer(playerID) {
    let tokenChoices = {
        s: 'Small',
        m: 'Medium',
        l: 'Large'
    }
    let chosen = false;
    for (token in tokenChoices) {
        if (players[playerID][token] !== 0) {
            console.log(token);
            document.getElementById(token+'_label').innerText = tokenChoices[token] + " (" + players[playerID][token] + ")"
            if (chosen === false) {
                chosen = true;
                // document.getElementById(token).parentNode.classList.add('active');
                selectedToken = token;
            } else {
                // document.getElementById(token).parentNode.classList.remove('active');
            }
        } else {
            console.log(document.getElementById(token).parentNode);
            document.getElementById(token).parentNode.style.visibility = 'hidden';
        }
    }
}

function getSelectedItem() {
    if (document.getElementById('s').hasAttribute('checked')) {
        return 's';
    } else if (document.getElementById('m').hasAttribute('checked')) {
        return 'm';
    }
    return 'l';
}

function showError() {
    alert("TODO.")
}

function verifyBoard(selectedCell, selectedToken) {
    selectedCell = parseInt(selectedCell, 10);
    // Check if current cell has all current player's tokens.
    if (selectedCell.s === currPlayer && selectedCell.m === currPlayer && selectedCell.l === currPlayer) {
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
    if (board[firstInRow+1]['m'] === currPlayer && ((board[firstInRow]['s'] === currPlayer && board[firstInRow+3]['l'] === currPlayer) || (board[firstInRow]['l'] === currPlayer && board[firstInRow+3]['s'] === currPlayer))) {
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