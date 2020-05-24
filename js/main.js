'use strict'
var gElTd;
const MINE = '💥';
const LIFE = '💖';
const FLAG = '⛳';
var gSafe = false;
var safeCount = 3;
var gLife = 3;
var markCount = 0;
var gGameInterval;
var shownCount = 0;
var gSecond = 0;
var gTimer = false;
var elSmile = document.querySelector('.smiley')
var elTimer = document.querySelector(".timer");
localStorage.setItem("Best Score : ", Infinity);

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gBoard = [];

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gMineId = 0;


function restart() {
    gSafe = false;
    safeCount = 3;
    gTimer = false;
    gLife = 3;
    markCount = 0;
    shownCount = 0;
    gSecond = 0;
    lifeCounter()
    gBoard = [];
    gMineId = 0;
    gGame = {
        isOn: true,
        markedCount: 0
    };
    elSmile.innerHTML = '<img src="img/smily.jpg" alt=""></img>'
}

function init() {
    clearInterval(gGameInterval)
    restart()
    buildBoard(gLevel)
    renderBoard()

}

function safeClick() {
    if (safeCount === 0) {
        return;
    }
    gSafe = true;
    safeCount--;
    var elSafe = document.querySelector('.safe');
    elSafe.innerHTML = `Safe Click X${safeCount}`
}



function gameOver() {

    clearInterval(gGameInterval)
    alert('Game Over start again ? ')
    gGame.isOn = false;
    elSmile.innerHTML = '<img src="img/smily2.jpg" alt=""></img>'
}

function won() {
    alert('Won !')
    elSmile.innerHTML = '<img src="img/smily3.jpg" alt=""></img>'
    for (var i = 0; i < gElTd.length; i++) {
        gElTd[i].classList.remove('hidden')
        gElTd[i].classList.add('shown')
    }
    var bestScore = localStorage.getItem("Best Score : ");
    if (bestScore > gSecond) {
        bestScore = gSecond.toFixed(3)
        var elBest = document.querySelector('.best')
        elBest.innerHTML = `Best Score :${bestScore}`
        localStorage.setItem("Best Score : ", bestScore);
    }
    
    clearInterval(gGameInterval)
    gGame.isOn = false;
}

function rightClick(cell) {
    if (gGame.isOn === false) {
        clearInterval(gGameInterval)
        return;
    }
    var i = +cell.getAttribute('i');
    var j = +cell.getAttribute('j');

    if (gBoard[i][j].isMine) {
        if(gBoard[i][j].isMarked===true){
            gGame.markedCount--;
        }else{
            gGame.markedCount++;
        }
        
    }
    markCount++
    if (gBoard[i][j].isMarked) {
     
        
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isShown = false;
        cell.classList.add('hidden');
        cell.innerHTML = gBoard[i][j].minesAroundCount;
    } else {
        gBoard[i][j].isMarked = true;
        cell.innerHTML = FLAG
        cell.classList.remove('hidden');
    }

    if (gGame.markedCount === gLevel.MINES) {
        clearInterval(gGameInterval)
        won();
    }
    if (markCount === 1 && gTimer === false) {
        gTimer = true;
        startTimer()
    }

}

function createCell() {
    var cell = {
        id: gMineId++,
        minesAroundCount: '',
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function buildBoard(gLevel) {
    var cell = {};
    for (var i = 0; i < gLevel.SIZE; i++) {
        var row = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            cell = createCell();
            row.push(cell);
            // console.log(row);
        }
        gBoard.push(row)
        // console.log(gBoard);
    }
}

function renderBoard() {

    var cellIdx = 0;
    var elTable = document.querySelector('table')
    var strHTML = '';
    strHTML += '<tr>\n';
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            strHTML += `<td class="hidden" id = ${cellIdx} data - i="${i}" data - j ="${j}"  
            onclick="cellClicked(this)" oncontextmenu="rightClick(this)"> ${gBoard[i][j].minesAroundCount}  `;
            cellIdx++
            strHTML += '\t</td>\n';
        }

        strHTML += '</tr>\n';
    }
    elTable.innerHTML = strHTML;
    var elTd = document.querySelectorAll('td')
    gElTd = elTd;
    for (var i = 0; i < gLevel.MINES; i++) {
        randomMine(elTd)
    }
    setMinesNegsCount(elTd)
}

function easy() {

    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    init();
}
function hard() {

    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    init();
}
function medium() {

    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    init();
}



function setMinesNegsCount(elTd) {
    var location = {
        i,
        j
    }
    for (var idx = 0; idx < elTd.length; idx++) {
        if (elTd[idx].innerHTML === MINE) {
            continue;
        }
        location.i = +elTd[idx].getAttribute('i');
        location.j = +elTd[idx].getAttribute('j');
        for (var i = location.i - 1; i <= location.i + 1; i++) {
            if (i < 0 || i >= gLevel.SIZE) {
                continue;
            }
            for (var j = location.j - 1; j <= location.j + 1; j++) {
                if (i === location.i && j === location.j) {
                    continue;
                }
                if (j < 0 || j >= gLevel.SIZE) {
                    continue;
                }

                if (gBoard[i][j].isMine === true) {

                    gBoard[location.i][location.j].minesAroundCount++
                }
            }
        }

        elTd[idx].innerText = gBoard[location.i][location.j].minesAroundCount;

    }

}

function expanding(cell) {
    var elTd = document.querySelectorAll('td')
    location.i = +cell.getAttribute('i');
    location.j = +cell.getAttribute('j');
    if (gBoard[location.i][location.j].isMine) {
        return;
    }
    if (gBoard[location.i][location.j].minesAroundCount === "") {
        for (var i = location.i - 1; i <= location.i + 1; i++) {
            if (i < 0 || i >= gLevel.SIZE) {
                continue;
            }
            for (var j = location.j - 1; j <= location.j + 1; j++) {
                if (i === location.i && j === location.j) {
                    continue;
                }
                if (j < 0 || j >= gLevel.SIZE) {
                    continue;
                }
                elTd[gBoard[i][j].id].classList.remove('hidden')
                elTd[gBoard[i][j].id].classList.add('shown')
            }
        }
    }
}


function cellClicked(cell) {
    expanding(cell)
    if (gGame.isOn === false) {
        clearInterval(gGameInterval)
        return;
    }
    var i = +cell.getAttribute('i');
    var j = +cell.getAttribute('j');
    if (cell.innerHTML === MINE) {
        if (gSafe === false) {
            gLife--
            lifeCounter()

        }
        if (gLife === 0) {
            gameOver();
        }
    }
    gSafe = false;
    if (gBoard[i][j].isShown) {
        return
    } else {
        cell.classList.remove('hidden')
        cell.classList.add('shown')
        gBoard[i][j].isShown = true;
        shownCount++
    }
    if (shownCount === 1&& gTimer === false) {
        gTimer=true;
        startTimer()
    }


}


function lifeCounter() {
    var elLife = document.querySelector('.life')
    var strHTML = '';
    strHTML = `Lives : <span>`
    for (var i = 0; i < gLife; i++) {
        strHTML += LIFE;
    }
    strHTML += `</span>`
    elLife.innerHTML = strHTML;
}



function randomMine() {
    var elTd = document.querySelectorAll('td');
    var i = getRandomInteger(0, elTd.length)
    var td = {};
    td.i = elTd[i].getAttribute('i')
    td.j = elTd[i].getAttribute('j')
    if (gBoard[td.i][td.j].isMine === true) {
        randomMine()
    }
    gBoard[td.i][td.j].isMine = true
    elTd[i].innerHTML = MINE;

}
function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function startTimer() {
    gGameInterval = setInterval(function () {
        gSecond += 0.121
        elTimer.innerText = ' Timer : ' + gSecond.toFixed(3) + ' Seconds '
    }, 121)
}
