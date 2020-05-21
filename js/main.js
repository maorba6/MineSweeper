'use strict'
const MINE = '💥';
const FLAG = '⛳';
const LIFE = '💖'
var gFlagCounter = 0;
var gSize = 4;
var gSafe = false;
var safeCount = 3;
var gGameInterval;
var gSecond = 0;
var gTimerOn = true;
var gBoard = [];
var gCount = -1;
var gGameOn = true;
var needMine = true;
var gMine = 2;
var elTd = document.querySelectorAll('td');
var elTimer = document.querySelector(".timer");
var gMineId = 0;
var lifeCount = 3;
var bestScore = Infinity;
var elSmile = document.querySelector('.smiley');

localStorage.setItem("Best Score", bestScore);

function createBoard(gSize) {
    var cell = {};
    for (var i = 0; i < gSize; i++) {
        var row = [];
        for (var j = 0; j < gSize; j++) {
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
    // console.log(elTable);
    var strHTML = '';
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            strHTML += `<td class="hidden" id = ${cellIdx} data - i="${i}" data - j ="${j}"  oncontextmenu="rightClick(this)" onclick = "cellClicked(this)"> ${gBoard[i][j].minesAroundCount} </td> `;
            cellIdx++
        }

        strHTML += '</tr>';
    }
    elTable.innerHTML = strHTML;

}

function randomMine() {
    var i = getRandomInteger(0, gSize)
    var j = getRandomInteger(0, gSize)
    gBoard[i][j].minesAroundCount = MINE;
}


function setMinesNegsCount(cell) {
    var elTd = document.querySelectorAll('td')
    var mineCount = 0;
    var location = {
        i: 0,
        j: 0
    }
    location.i = +cell.getAttribute('i');
    location.j = +cell.getAttribute('j');

    // console.log(location);
    if (gBoard[location.i][location.j].minesAroundCount === MINE) {
        cell.innerText = MINE;
        return;

    }
    for (var idx = location.i - 1; idx <= location.i + 1; idx++) {
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (idx < 0 || idx >= gSize || j < 0 || j >= gSize) {
                continue;
            }
            if (gBoard[idx][j].minesAroundCount === MINE) {
                mineCount++
            } else if (gBoard[idx][j].minesAroundCount !== MINE) {
                if (gBoard[idx][j].isShown === false) {
                    gCount++;
                    gBoard[idx][j].isShown = true;
                }
                elTd[gBoard[idx][j].id].classList.remove('hidden')
            }

        }
    }
    gBoard[location.i][location.j].minesAroundCount = mineCount;
    cell.innerText = mineCount;
    renderBoard
}



function cellClicked(cell) {

    var i = +cell.getAttribute('i');
    var j = +cell.getAttribute('j');
    var bestScore = localStorage.getItem("Best Score");
    setMinesNegsCount(cell)
    if (gBoard[i][j].isShown = false) {
        gCount++
    }
    elTd = document.querySelectorAll('td')
    if (!gGameOn) {
        return;
    }
    if (gTimerOn) {
        startTimer()
        gTimerOn = false;
    }
    if (gCount > (gSize ** 2) - gMine) {
        clearInterval(gGameInterval)
        gGameOn = false;
        if (bestScore > gSecond) {
            var bestScore = gSecond.toFixed(3);
            var elBest = document.querySelector('.best')
            elBest.innerHTML = `Best Score :${bestScore}`
            localStorage.setItem("Best Score", bestScore);
        }
        alert('Won!');
    }

    if (needMine) {
        for (var index = 0; index < gMine; index++) {
            randomMine();

        }
        needMine = false;

        renderBoard()

        return;
    }
    setMinesNegsCount(cell)
    if (cell.innerText === MINE) {
        if (lifeCount === 0) {
            var elTd = document.querySelectorAll('td');
            for (var i = 0; i < elTd.length; i++) {
                if (elTd[i].innerText === MINE) {
                    elTd[i].classList.remove('hidden')
                }
            }
        }
        if (!gSafe) {
            lifeCount--;
            lifeCounter();
            if (lifeCount === 0) {
                elSmile.innerHTML = '<img src="img/smily2.jpg" alt=""></img>'
                setTimeout(alert, 100, 'Lost Try again later')
                gGameOn = false;
                clearInterval(gGameInterval)
            }
        }
    }
    gBoard[i][j].isShown = true;
    cell.classList.remove('hidden')
    // console.log(cell);

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

function easy() {
    gSize = 4;
    gMine = 2;
    init();
}
function hard() {
    gSize = 12;
    gMine = 30;
    init();
}
function medium() {
    gSize = 8;
    gMine = 12;
    init();
}


function init() {
    gTimerOn = true;
    safeCount = 3;
    gSafe = false;
    needMine = true;
    gFlagCounter = 0;
    elSmile.innerHTML = '<img src="img/smily.jpg" alt=""></img>'
    gMineId = 0;
    lifeCount = 3;
    lifeCounter()
    clearInterval(gGameInterval)
    elTimer.innerText = ' Timer : ' + 0 + ' Seconds '
    gSecond = 0;
    gCount = -1;
    gBoard = [];
    gGameOn = true;
    createBoard(gSize);
    elTd = document.querySelectorAll('td')
    renderBoard();
}


function createCell() {
    var cell = {
        id: gMineId++,
        minesAroundCount: 1,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

function lifeCounter() {
    var elLife = document.querySelector('.life')
    var strHTML = '';
    strHTML = `Lives : <span>`
    for (var i = 0; i < lifeCount; i++) {
        strHTML += LIFE;
    }
    strHTML += `</span>`
    elLife.innerHTML = strHTML;
}

function rightClick(cell) {
    var bestScore = localStorage.getItem("Best Score");

    if (gTimerOn) {
        startTimer()
        gTimerOn = false;
    }
    var location = {
        i: 0,
        j: 0
    }
    location.i = +cell.getAttribute('i');
    location.j = +cell.getAttribute('j');

    if (gBoard[location.i][location.j].isShown) {
        return;
    }
    if (!gBoard[location.i][location.j].isMarked) {
        gBoard[location.i][location.j].isMarked = true;
        cell.innerHTML = FLAG;
        cell.classList.toggle('hidden')
    } else {

        gBoard[location.i][location.j].isMarked = false;
        cell.innerHTML = gBoard[location.i][location.j].minesAroundCount;
        cell.classList.toggle('hidden')

    }

    if (gBoard[location.i][location.j].minesAroundCount === MINE) {
        gFlagCounter++
        gBoard[location.i][location.j].isMarked = true;

        if (gFlagCounter === gMine) {
            var elTd = document.querySelectorAll('td');
            for (var i = 0; i < elTd.length; i++) {
                elTd[i].classList.remove('hidden')
            }
            if (bestScore > gSecond) {
                var bestScore = gSecond.toFixed(3);
                var elBest = document.querySelector('.best')
                elBest.innerHTML = `Best Score :${bestScore}`
                localStorage.setItem("Best Score", bestScore);
            }
            elSmile.innerHTML = '<img src="img/smily3.jpg" alt=""></img>'
            setTimeout(alert, 100, 'Won !! Play again ? ')
            gGameOn = false;
            clearInterval(gGameInterval)
        }
    }

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
