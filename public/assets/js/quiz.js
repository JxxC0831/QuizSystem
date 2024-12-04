let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft;

// fetch questions from API open trivia database(https://opentdb.com/api.php?amount=10)
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');//fetching 10 questions
        const data = await response.json();
        questions = data.results;//store the question in array
        showQuestion();//display the question
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

//display the question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestion];
    
    // update category
    document.getElementById('categoryBadge').innerHTML = `
        <i class="fas fa-tag"></i>
        <span>${question.category}</span>
    `;
    
    // update question number and progress bar
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // update question text
    document.getElementById('question').innerHTML = decodeHTML(question.question);

    // mix options, shuffle the options
    const options = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(options);

    // create option buttons
    const optionsHtml = options.map(option => `
        <button class="option-btn" onclick="checkAnswer('${option}')">
            ${decodeHTML(option)}
        </button>
    `).join('');

    document.getElementById('options').innerHTML = optionsHtml;
    
    // reset timer for next question
    resetTimer();
}

//check the answer
function checkAnswer(selectedAnswer) {
    clearInterval(timer);//clear the timer
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    // disable all buttons and show correct/wrong answers
    buttons.forEach(button => {
        button.classList.add('disabled');
        const buttonText = button.textContent.trim();
        
        if (buttonText === decodeHTML(question.correct_answer)) {
            button.classList.add('correct');
        } else if (buttonText === decodeHTML(selectedAnswer) && selectedAnswer !== question.correct_answer) {
            button.classList.add('wrong');
        }
    });

    // increase score if answer is correct
    if (selectedAnswer === question.correct_answer) {
        score++;
    }

    // show next question
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

//display the result
function showResult() {
    // hide quiz container and show result card
    document.querySelector('.quiz-container').classList.add('d-none');
    document.getElementById('resultCard').classList.remove('d-none');
    
    const totalQuestions = questions.length;
    const wrongAnswers = totalQuestions - score;
    const accuracy = Math.round((score / totalQuestions) * 100);
    //display the score
    document.getElementById('score').textContent = score;
    document.getElementById('correctAnswers').textContent = `${score} Correct`;
    document.getElementById('wrongAnswers').textContent = `${wrongAnswers} Wrong`;
    document.getElementById('accuracy').textContent = `${accuracy}% Accuracy`;
    
    // save score
    saveScore(score);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.querySelector('.quiz-container').classList.remove('d-none');
    document.getElementById('resultCard').classList.add('d-none');
    fetchQuestions();
}

//reset the timer
function resetTimer() {
    clearInterval(timer);//clear the timer
    timeLeft = 30;//set the time to 30 seconds
    document.getElementById('timer').textContent = `${timeLeft}s`;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `${timeLeft}s`;
        
        // when time is less than 10 seconds, add animation effect
        if (timeLeft <= 10) {
            document.getElementById('timer').classList.add('bg-danger');
        } else {
            document.getElementById('timer').classList.remove('bg-danger');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);//stop the timer
            checkAnswer('');
        }
    }, 1000);
}

//save the score
async function saveScore(score) {
    try {
        // get the category of the first question as the overall quiz category
        const category = questions[0]?.category || 'General Knowledge';
        
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: score,
                category: category,
                total_questions: questions.length
            })
        });
        
        const data = await response.json();
        if (data.error) {
            console.error('Error saving score:', data.error);
        } else {
            console.log('Score saved successfully');
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// helper function, use to shuffle the options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// check login status and initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (!data.isLoggedIn) {
            window.location.href = '/login';
            return;
        }
        
        // update navigation
        const navItems = document.getElementById('navItems');
        navItems.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/quiz">Start Quiz</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/rankings">Rankings</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/profile">Profile</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Logout</a>
            </li>
        `;
        
        // start loading questions
        fetchQuestions();
    } catch (error) {
        console.error('Error checking auth status:', error);
        window.location.href = '/login';
    }
});  