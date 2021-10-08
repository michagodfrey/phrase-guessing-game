const start = document.querySelector('.btn__reset');
const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const phrases = [
  'Go down the rabbit hole',
  'Bull in a china shop',
  'Fish out of water',
  'Raining cats and dogs',
  'Mad as cut snakes'
];
let missed;
let phraseLetterCount;

// hide start overlay when game begins
start.addEventListener('click', () => {
  missed = 0;
  phraseLetterCount = 0;
  document.getElementById('overlay').style.display = 'none';
  addPhraseToDisplay(getRandomPhraseAsArray);
});

// takes a random phrase and splits it into a new array of characters
const getRandomPhraseAsArray = array => {
  // choose random array from phrases
  let randomPhrase = array[Math.floor(Math.random() * array.length)];
  return randomPhrase.split("");
};

// adds lettters of a string to the display
const addPhraseToDisplay = () => {
  const input = getRandomPhraseAsArray(phrases);
  const ul = document.querySelector('ul');
  // loop through array supplied by getRandomPhraseAsArray and create li item for each character
  for (let i = 0; i < input.length; i++) {
    const li = document.createElement('li');
    // assign each letter the class 'letter' and space the clasee 'space'
    li.textContent = input[i];
    if (li.textContent == ' ') {
      li.className = 'space';
    } else {
      li.className = 'letter';
      // tally the number of letters for the checkWin function
      phraseLetterCount ++;
    }
    // append li elements to ul in #phrase div element
    ul.appendChild(li);
    phrase.appendChild(ul);
  }
};

// check if the letter clicked is in the phrase
const checkLetter = button => {
  const letters = document.querySelectorAll('.letter');
  let match = null;
  // loop thru letters and check if it matches the button letter clicked
  for (let i = 0; i < letters.length; i++) {
    // if button letter in letters, change class to display the li element
    if (button === letters[i].textContent.toLowerCase()) {
      letters[i].className = 'show';
      match = button;
    }
  }
  checkWin();
  return match;
};

// check if game has been won or lost
const  checkWin = () => {
  const shown = document.querySelectorAll('.show');
  const ul = document.querySelector('ul');
  // if letters with class show is equal to the number of letters with class letters, show win overlay screen
  if (shown.length === phraseLetterCount) {
    document.querySelector('.title').textContent = 'You got it! Well done.';
    document.getElementById('overlay').className = 'win';
    document.getElementById('overlay').style.display = 'flex';
    start.className = 'reset';
    document.querySelector('.reset').textContent = 'Play again';
    removePhrase(ul);
    resetHearts();
    resetButtons();
  } else {
    // else if misses is 5 or more, show the overlay screen with lose class and text
    if (missed > 4) {
      document.querySelector('.title').textContent = 'Too bad! Try again.';
      document.getElementById('overlay').className = 'lose';
      document.getElementById('overlay').style.display = 'flex';
      start.className = 'reset';
      document.querySelector('.reset').textContent = 'Play again';
      removePhrase(ul);
      resetHearts();
      resetButtons();
    }
  }
};

// remove the displayed phrase when the game ends. The while loop was adapted from https://attacomsian.com/blog/javascript-dom-remove-all-children-of-an-element
const removePhrase = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

// reset the hearts
const resetHearts = () => {
  if (missed > 0) {
    for (let i = 0; i < missed; i++) {
      li = document.getElementsByClassName('miss')[0];
      heart = li.firstElementChild;
      heart.src = "images/liveHeart.png";
      li.className = "tries";
    }
  }
};

// reset buttons for new game
const resetButtons = () => {
  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
    buttons[i].classList.remove('chosen');
  }
};

// listen for keyboard to be clicked
qwerty.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const button = e.target;
    // if letter not found, remove one heart, missed ++
    const letters = document.querySelectorAll('.letter');
    // add letters to a list so the includes() function can be used
    let charList = [];
    for (let i = 0; i < letters.length; i++) {
        charList.push(letters[i].textContent.toLowerCase());
      }
      // change heart to lost heart image
      if (!charList.includes(button.textContent)) {
        li = document.getElementsByClassName('tries')[0];
        heart = li.firstElementChild;
        heart.src = "images/lostHeart.png";
        li.className = "miss";
        missed++;
      }
    // change button class and disable it to show it has been clicked
    button.disabled = true;
    button.className = 'chosen';
    // call checkLetter function and pass letter as the argument
    checkLetter(button.textContent);
  }
});
