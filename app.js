const start = document.querySelector('.btn__reset');
const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const loading = document.querySelector(".loading");

// set variables used for game
let missed = 0;
let phraseLetterCount = 0;
let firstGame = true;

// fetch the random phrase from Firebase, randomized phrase generated on the server side
async function loadPhrase() {
  try {
    const res = await fetch("https://us-central1-guess-animal-idiom.cloudfunctions.net/app/random-phrase");
    const result = await res.json()
    .then((result) => {
      loading.style.display = 'none';
      document.querySelector('.display__phrase').textContent = result.phrase;
      document.querySelector('.display__meaning').textContent = result.meaning;
      document.querySelector('.display__example').textContent = result.example;
      addPhraseToDisplay(result.phrase);
    });
} catch(err) {
  console.log(err);
  loading.style.color = 'red';
  loading.innerHTML = `Error fetching phrase, sorry about that :(`
}
}

// hide start overlay when new game begins
start.addEventListener('click', () => {
  if (firstGame === true) {
    document.getElementById('overlay').style.display = 'none';
    firstGame = false;
  } else {
    // reset phrase and variables for new game
    missed = 0;
    phraseLetterCount = 0;
    document.getElementById('overlay').style.display = 'none';
    loadPhrase();
  }
});

// takes a random phrase and splits it into a new array of characters then adds to the display
const addPhraseToDisplay = array => {
  let randomPhrase = array.split("");
  const ul = document.querySelector('ul');
  // loop through array supplied by getRandomPhraseAsArray and create li item for each character
  for (let i = 0; i < randomPhrase.length; i++) {
    const li = document.createElement('li');
    // assign each letter the class 'letter' and space the clasee 'space'
    li.textContent = randomPhrase[i];
    if (li.textContent == ' ') {
      li.className = 'space';
    } else if (li.textContent == "'") {
      li.className = 'show-start'
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
  // loop thru letters and check if it matches the button letter clicked
  for (let i = 0; i < letters.length; i++) {
    // if button letter in letters, change class to display the li element
    if (button === letters[i].textContent.toLowerCase()) {
      letters[i].className = 'show';
      letters[i].style.animation = 'spin 1s'
    }
  }
  checkWin();
};

// check if game has been won or lost
const  checkWin = () => {
  const shown = document.querySelectorAll('.show');
  const ul = document.querySelector('ul');
  // if letters with class show is equal to the number of letters with class letters, show win overlay screen
  if (shown.length === phraseLetterCount) {
    setTimeout(function() {
      document.querySelector('.title').textContent = 'You got it! Well done.';
      document.getElementById('overlay').className = 'win';
      document.getElementById('overlay').style.display = 'flex';
      document.querySelector('.display').style.display = 'block';
      loading.style.display = 'block'
      start.textContent = 'Play again';
      removePhrase(ul);
      resetHearts();
      resetButtons();
    }, 2000);
  } else {
    // else if misses is 5 or more, show the overlay screen with lose class and text
    if (missed > 4) {
      setTimeout(function() {
        document.querySelector('.title').textContent = 'Too bad! Try again.';
        document.getElementById('overlay').className = 'lose';
        document.getElementById('overlay').style.display = 'flex';
        document.querySelector('.display').style.display = 'none';
        loading.style.display = 'block'
        start.textContent = "Play again";
        removePhrase(ul);
        resetHearts();
        resetButtons();
      }, 1000);
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
      li.className = "try";
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
        li = document.getElementsByClassName('try')[0];
        button.style.animation = 'shake 1s'
        li.style.animation = 'shake 1s'
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

window.onload = loadPhrase();
