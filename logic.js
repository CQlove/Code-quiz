// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here
var time = 75;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');
var feedbackEl1 = document.getElementById('feedback1');

function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  // un-hide questions section
  questionsEl.removeAttribute('class');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  getQuestion();
}
  
function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title; //think dot notation

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = i + 1 + '. ' + choice;
    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event){
  var buttonEl = event.target;
  console.log(event);
  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }
  // check if user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 10;     
    // display new time on page
    timerEl.textContent = time;
  }
  // flash right/wrong feedback on page for half a second
  
    if (buttonEl.value !== questions[currentQuestionIndex].answer) {
      setTimeout(function () 
      {feedbackEl.classList.toggle("hide");
      console.log("wrong");},500)
    } else {
      setTimeout(function () 
      {feedbackEl1.classList.toggle("hide");
      console.log("right");},500)
    }
  
  feedbackEl1.setAttribute('class', 'hide');
  feedbackEl.setAttribute('class', 'hide');

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions or if time ran out?
  if (time <= 0 || currentQuestionIndex === questions.length) {
    //goes into next function
    quizEnd();
  } else {
    // call function again
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  // update time
  // decrement the variable we are using to track time
  timerEl.textContent = time--; 

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !=="") {

    // get saved scores from localstorage, or if not any, set to empty array
    
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
