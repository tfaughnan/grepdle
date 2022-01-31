var WORDLIST_PATH = 'wordlist.txt'
var WORD_LENGTH = 5;
var MAX_GUESSES = 6;

var bodyStyle = getComputedStyle(document.body);
var BLACK = bodyStyle.getPropertyValue('--black').trim();
var WHITE = bodyStyle.getPropertyValue('--white').trim();
var LIGHTGRAY = bodyStyle.getPropertyValue('--lightgray').trim();
var MEDGRAY = bodyStyle.getPropertyValue('--medgray').trim();
var DARKGRAY = bodyStyle.getPropertyValue('--darkgray').trim();
var YELLOW = bodyStyle.getPropertyValue('--yellow').trim();
var GREEN = bodyStyle.getPropertyValue('--green').trim();
var RED = bodyStyle.getPropertyValue('--red').trim();

var wordlist = new Array();
var guesses = new Array(MAX_GUESSES).fill('');
var guessNumber = 0;
var charNumber = 0;
var targetWord;

window.onload = main;

function main() {
        fetchWords();
        buildGrid();
        buildKb();
        document.addEventListener('keydown', inputHandler)
}

function fetchWords() {
        let client = new XMLHttpRequest();
        client.open('GET', WORDLIST_PATH);
        client.onreadystatechange = function() {
                if (client.readyState == 4 && client.status == 200) {
                        wordlist = client.responseText.split('\n');
                        wordlist = wordlist.filter(word => word.length == WORD_LENGTH);
                        wordlist = wordlist.map(word => word.trim());
                        wordlist = wordlist.map(word => word.toLowerCase());
                        targetWord = wordlist[Math.floor(Math.random() * wordlist.length)];
                }
        }
        client.send();
}

function buildGrid() {
        let grid = document.getElementById('grid');
        for (let i = 0; i < MAX_GUESSES; i++) {
                let row = document.createElement('div');
                for (let j = 0; j < WORD_LENGTH; j++) {
                        let cell = document.createElement('div');
                        cell.classList.add('cell');
                        cell.style.backgroundColor = WHITE;
                        cell.style.borderColor = LIGHTGRAY;

                        row.appendChild(cell);
                }
                grid.appendChild(row);
        }
}

function buildKb() {
        let keys = [
                ['q','w','e','r','t','y','u','i','o','p'],
                ['a','s','d','f','g','h','j','k','l'],
                ['Enter','z','x','c','v','b','n','m','Backspace']
        ];
        let kb = document.getElementById('kb');
        for (let i = 0; i < keys.length; i++) {
                let row = document.createElement('div');
                row.classList.add('kb-row');
                for (let j = 0; j < keys[i].length; j++) {
                        let key = document.createElement('div');
                        key.innerHTML = keys[i][j] != 'Backspace' ? keys[i][j] : `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 11.59375 7 L 11.28125 7.28125 L 3.28125 15.28125 L 2.59375 16 L 3.28125 16.71875 L 11.28125 24.71875 L 11.59375 25 L 29 25 L 29 7 Z M 12.4375 9 L 27 9 L 27 23 L 12.4375 23 L 5.4375 16 Z M 15.15625 11.75 L 13.75 13.15625 L 16.59375 16 L 13.75 18.84375 L 15.15625 20.25 L 18 17.40625 L 20.84375 20.25 L 22.25 18.84375 L 19.40625 16 L 22.25 13.15625 L 20.84375 11.75 L 18 14.59375 Z"/></svg>`
                        key.classList.add('key');
                        key.setAttribute('data-key', keys[i][j]);
                        row.appendChild(key);

                        key.addEventListener('click', inputHandler);

                        key.key = keys[i][j];
                        switch (keys[i][j]) {
                                case 'Enter':
                                        key.keyCode = 13;
                                        break;
                                case 'Backspace':
                                        key.keyCode = 8;
                                        break;
                                default:
                                        key.keyCode = keys[i][j].charCodeAt(0);
                        }
                }
                kb.appendChild(row);
        }
}

function inputHandler(e) {
        let grid = document.getElementById('grid');
        const code = e.keyCode ? e.keyCode : e.currentTarget.keyCode;
        const letter = e.key ? e.key.toLowerCase() : e.currentTarget.key.toLowerCase();

        let guessLength = guesses[guessNumber].length;
        if (
                ((code > 64 && code < 91) || (code > 96 && code < 123))
                && guessLength < WORD_LENGTH
        ) {
                let cell = grid.children[guessNumber].children[charNumber];
                guesses[guessNumber] += letter;
                cell.innerHTML = letter;
                cell.style.borderColor = MEDGRAY;
                charNumber++;
        } else if (code == 8 && guessLength > 0) {
                guesses[guessNumber] = guesses[guessNumber].substring(0, guessLength - 1)
                charNumber--;
                let cell = grid.children[guessNumber].children[charNumber];
                cell.innerHTML = '';
                cell.style.borderColor = LIGHTGRAY;
        } else if (code == 13 && guessLength == WORD_LENGTH) {
                if (wordlist.includes(guesses[guessNumber])) {
                        let guess = guesses[guessNumber];
                        let targetTmp = targetWord.slice();
                        for (let i = 0; i < WORD_LENGTH; i++) {
                                let cell = grid.children[guessNumber].children[i];
                                let pos = targetTmp.indexOf(guess[i]);
                                let key = document.querySelector(`[data-key="${guess[i]}"]`);
                                let keyBgColor = getComputedStyle(key).getPropertyValue('background-color');
                                keyBgColor = rgbToHex(keyBgColor);
                                if (pos == -1) {
                                        cell.style.backgroundColor = DARKGRAY;
                                        cell.style.borderColor = DARKGRAY;
                                        if ([LIGHTGRAY, ''].includes(keyBgColor)) {
                                                key.style.backgroundColor = DARKGRAY;
                                                key.style.color = WHITE;
                                        }
                                } else if (pos == i) {
                                        cell.style.backgroundColor = GREEN;
                                        cell.style.borderColor = GREEN;
                                        if ([YELLOW, LIGHTGRAY, ''].includes(keyBgColor)) {
                                                key.style.backgroundColor = GREEN;
                                                key.style.color = WHITE;
                                        }
                                        targetTmp = setCharAtIndex(targetTmp, pos, ' ');
                                } else {
                                        cell.style.backgroundColor = YELLOW;
                                        cell.style.borderColor = YELLOW;
                                        if ([LIGHTGRAY, ''].includes(keyBgColor)) {
                                                key.style.backgroundColor = YELLOW;
                                                key.style.color = WHITE;
                                        }
                                        targetTmp = setCharAtIndex(targetTmp, pos, ' ');
                                }
                                cell.style.color = WHITE;

                        }

                        if (guess == targetWord) {
                                document.removeEventListener('keydown', inputHandler)
                                msg = document.getElementById('msg');
                                msg.innerHTML = 'Correct!';
                                msg.style.visibility = 'visible';
                        } else if (guessNumber == MAX_GUESSES - 1) {
                                document.removeEventListener('keydown', inputHandler)
                                msg = document.getElementById('msg');
                                msg.innerHTML = 'The word was <em>' + targetWord + '</strong>';
                                msg.style.visibility = 'visible';
                        }

                        guessNumber++;
                        charNumber = 0;
                } else {
                        msg = document.getElementById('msg');
                        msg.innerHTML = 'Not in word list!';
                        msg.style.visibility = 'visible';
                        setTimeout(function() {
                                msg.style.visibility = 'hidden';
                        }, 1000);
                }
        }
}

function setCharAtIndex(s, i, c) {
        return s.substring(0, i) + c + s.substring(i + 1);
}

const rgbToHex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n,10).toString(16).padStart(2,'0')).join('')}`
