"use strict";
var d = document;
var gameWindow = d.getElementById('gameWindow');

var guessingWord = [];
var wordStatus = [];
var wrongLetters = [];
var mistakes = 0;
var rightLetters = [];
var spaces = [];

function getStarted() {
  gameWindow.innerHTML = '<h2>Ready?</h2><br /><button type="button" onclick="openSetup()">Let\'s get started!</button>';
}
getStarted();

function openSetup() {
  gameWindow.innerHTML = '<h2>Enter your word!<h2><form onsubmit="return enterWord();"><input type="text" autocomplete="off" id="wordInput" /><button type="button" onclick="return enterWord();">Submit</button></form>';
}

function enterWord() {
  var wordEntered = d.getElementById('wordInput').value.toLowerCase();
  findSpaces(wordEntered);
  wordEntered = wordEntered.replace(/\s/g, '');
  wordEntered = wordEntered.replace(/\W/g, '');
  guessingWord = [];
  for (var i = 0; i < wordEntered.length; i++) {
    guessingWord.push(wordEntered[i]);
  }
  gameWindow.innerHTML = '<div id="wordDisplay"></div><div id="guessingArea"></div><div id="errorBox"></div><div id="wrongGuesses"></div><div id="countdown"></div>';
  d.getElementById('countdown').innerHTML = "<h3>Mistakes: </h3><p>" + mistakes + '</p>';
  d.getElementById('wrongGuesses').innerHTML = '<h3>Wrong guesses: </h3><p>' + 'none' + '</p>';
  var pleasePutThisInTheFuckingDiv = '';
  pleasePutThisInTheFuckingDiv += '<span class="word">';
  for (var i = 0; i < guessingWord.length; i++) {
    for (var space = 0; space < spaces.length; space++) {
      var slot = spaces[space] - space;
      if (slot === i) {
        pleasePutThisInTheFuckingDiv += '</span><span class="word">';
        console.log('word ends before character ' + slot);
      }
    }
    pleasePutThisInTheFuckingDiv += '<div class="letter" id=letter' + [i] + '> ' + guessingWord[i] + ' </div>';
    console.log('put in ' + i + 'th letter');
    // d.getElementById('letter' + [i]).classList.add('hidden');
    wordStatus[i] = false;
  }
  pleasePutThisInTheFuckingDiv += '</span>';
  d.getElementById('wordDisplay').innerHTML = pleasePutThisInTheFuckingDiv;
  for (var i = 0; i < guessingWord.length; i++) {
    d.getElementById('letter' + [i]).classList.add('hidden')
  };
  console.log('what the fuck');
  // for (var i = 0; i < guessingWord.length; i++) {
  //   d.getElementById('wordDisplay').innerHTML += '<div class="letter" id=letter' + [i] + '> ' + guessingWord[i] + ' </div>';
  //   d.getElementById('letter' + [i]).classList.add('hidden');
  //   wordStatus[i] = false;
  // }
  for (var i = 0; i < spaces.length; i++) {
    var spot = spaces[i] - i;
    d.getElementById('letter' + spot).classList.add('spaceBefore');
    console.log('adding space before character ' + spot);
  }
  d.getElementById('guessingArea').innerHTML = '<form onsubmit="return processGuess();"><input type="text" autocomplete="off" id="guess" /><button type="button" onclick="return processGuess();">Submit Guess</button></form>';
  if (wordEntered.length === 0) {
    d.getElementById('wordDisplay').innerHTML = 'You didn\'t enter a word.';
  }
  return false;
}

function findSpaces(word) {
  var product = [];
  for (var i = 0; i < word.length; i++) {
    product.push(word[i]);
  }
  for (var i = 0; i < product.length; i++) {
    var num = i;
    if (product[i] === " ") {
      spaces.push(num);
    }
  }
  console.log('the following characters are spaces, ' + spaces);
}

function processGuess() {
  var guess = d.getElementById('guess').value.toLowerCase();
  guess = guess.replace(/\W/g, '');
  if (guess.length === 0) {
    d.getElementById('errorBox').innerHTML = "You didn't enter anything!";
    d.getElementById('guess').value = "";
  } else if (guess.length !== 1) {
    d.getElementById('errorBox').innerHTML = "You can only enter one letter at a time.";
    d.getElementById('guess').value = "";
  } else if (wrongLetters.indexOf(guess) > -1) {
    d.getElementById('errorBox').innerHTML = "You already guessed that.";
    d.getElementById('guess').value = "";
  } else if (rightLetters.indexOf(guess) > -1) {
    d.getElementById('errorBox').innerHTML = "You already guessed that.";
    d.getElementById('guess').value = "";
  } else if (guess.length === 1) {
    d.getElementById('errorBox').innerHTML = "";
    return checkGuess(guess);
  }
  return false;
}

function checkGuess(guess) {
  var found = false;
  for (var i = 0; i < guessingWord.length; i++) {
    if (guess === guessingWord[i]) {
      found = true;
      d.getElementById('letter' + [i]).classList.remove('hidden');
      d.getElementById('letter' + [i]).classList.add('shown');
      wordStatus[i] = true;
      rightLetters.push(guess);
    }
  }
  if (found === false) {
    wrongLetters.push(guess);
    d.getElementById('wrongGuesses').innerHTML = '<h3>Wrong guesses: </h3><p>' + wrongLetters + '</p>';
    mistakes += 1;
    d.getElementById('countdown').innerHTML = "<h3>Mistakes: </h3><p>" + mistakes + '</p>';
    checkFail();
  } else if (found === true) {
    checkWin();
  }
  d.getElementById('guess').value = "";
  return false;
}

function checkFail() {
  if (mistakes === 9) {
    d.getElementById('countdown').classList.add('redText');
  }
  else if (mistakes === 10) {
    for (var i = 0; i < wordStatus.length; i++) {
      if (wordStatus[i] === false) {
        d.getElementById('letter' + [i]).classList.add('missing');
      }
    }
    d.getElementById('errorBox').innerHTML = 'You lost!';
    d.getElementById('errorBox').classList.add('defeat');
    d.getElementById('guessingArea').classList.add('hide');
  }
  return false;
}

function checkWin() {
  var win = true;
  for (var i = 0; i < wordStatus.length; i++) {
    if (wordStatus[i] === false) {
      win = false;
    }
  }
  if (win === true) {
    d.getElementById('errorBox').innerHTML = 'You win!';
    d.getElementById('errorBox').classList.add('victory');
    d.getElementById('guessingArea').classList.add('hide');
  }
}
