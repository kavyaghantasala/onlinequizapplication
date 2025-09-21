// DOM Elements
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");

const authCard = document.getElementById("auth-card");
const dashboard = document.getElementById("dashboard");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");
const createQuizSection = document.getElementById("create-quiz-section");
const createQuizBtn = document.getElementById("create-quiz-btn");
const createQuizDashBtn = document.getElementById("create-quiz-dash-btn");
const quizForm = document.getElementById("quiz-form");
const questionsContainer = document.getElementById("questions-container");
const addQuestionBtn = document.getElementById("add-question-btn");
const removeQuestionBtn = document.getElementById("remove-question-btn");
const quizzesContainer = document.getElementById("quizzes-container");

const dashboardBtn = document.getElementById("dashboard-btn");
const takeQuizBtn = document.getElementById("take-quiz-btn");
const logoutBtn = document.getElementById("logout-btn");

// State
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let userQuizzes = [];
let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let questionCount = 1;

// Quiz Data
const quizTemplates = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup"],
    correctAnswer: 0,
  },
  {
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style"],
    correctAnswer: 1,
  },
  {
    question: "Which symbol starts a JS single-line comment?",
    options: ["//", "<!--", "#"],
    correctAnswer: 0,
  },
];

// Initialize the application
function init() {
  // Update user quizzes
  if (currentUser) {
    userQuizzes = quizzes.filter(quiz => quiz.creator === currentUser.email);
  }
  
  // Render user quizzes
  renderUserQuizzes();
}

// -------------------- AUTH --------------------
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

showSignup.addEventListener("click", () => signupTab.click());
showLogin.addEventListener("click", () => loginTab.click());

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (users.find((u) => u.email === email)) {
    alert("User already exists.");
    loginTab.click();
    return;
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  
  // Automatically log in the user after signup
  currentUser = { email, password };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Signup successful! You are now logged in.");
  signupForm.reset();
  showDashboard();
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    showDashboard();
  } else {
    alert("Invalid credentials.");
  }
});

// -------------------- DASHBOARD --------------------
function showDashboard() {
  authCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  createQuizSection.classList.add("hidden");
  
  // Update user quizzes
  userQuizzes = quizzes.filter(quiz => quiz.creator === currentUser.email);
  renderUserQuizzes();
}

// -------------------- QUIZ --------------------
function startQuiz() {
  currentQuiz = [...quizTemplates];
  currentIndex = 0;
  score = 0;
  dashboard.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  createQuizSection.classList.add("hidden");
  loadQuestion();
}

function loadQuestion() {
  const currentQ = currentQuiz[currentIndex];
  questionElement.textContent = currentQ.question;
  optionsContainer.innerHTML = "";
  currentQ.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsContainer.appendChild(btn);
  });
  
  // Hide next button until an answer is selected
  nextBtn.style.display = "none";
}

function checkAnswer(selected) {
  const correct = currentQuiz[currentIndex].correctAnswer;
  const options = optionsContainer.querySelectorAll(".option-btn");
  
  // Disable all buttons after selection
  options.forEach(btn => {
    btn.disabled = true;
  });
  
  // Highlight correct and incorrect answers
  options[correct].style.backgroundColor = "#4CAF50";
  options[correct].style.color = "white";
  
  if (selected !== correct) {
    options[selected].style.backgroundColor = "#F44336";
    options[selected].style.color = "white";
  } else {
    score++;
  }
  
  // Show next button
  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < currentQuiz.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  scoreElement.textContent = `${score} / ${currentQuiz.length}`;
}

// -------------------- CREATE QUIZ --------------------
createQuizBtn.addEventListener("click", showCreateQuiz);
createQuizDashBtn.addEventListener("click", showCreateQuiz);

function showCreateQuiz() {
  authCard.classList.add("hidden");
  dashboard.classList.add("hidden");
  quizContainer.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  createQuizSection.classList.remove("hidden");
}

// Add question
addQuestionBtn.addEventListener("click", () => {
  questionCount++;
  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question-form");
  newQuestion.innerHTML = `
    <label>Question ${questionCount}</label>
    <textarea class="question-text" placeholder="Enter your question" required></textarea>
    
    <div class="option-input">
      <input type="radio" name="correct-option-${questionCount-1}" class="correct-option" value="0" checked>
      <input type="text" class="option-text" placeholder="Option 1" required>
    </div>
    
    <div class="option-input">
      <input type="radio" name="correct-option-${questionCount-1}" class="correct-option" value="1">
      <input type="text" class="option-text" placeholder="Option 2" required>
    </div>
    
    <div class="option-input">
      <input type="radio" name="correct-option-${questionCount-1}" class="correct-option" value="2">
      <input type="text" class="option-text" placeholder="Option 3" required>
    </div>
    
    <div class="option-input">
      <input type="radio" name="correct-option-${questionCount-1}" class="correct-option" value="3">
      <input type="text" class="option-text" placeholder="Option 4" required>
    </div>
  `;
  questionsContainer.appendChild(newQuestion);
});

// Remove question
removeQuestionBtn.addEventListener("click", () => {
  if (questionCount > 1) {
    questionsContainer.removeChild(questionsContainer.lastChild);
    questionCount--;
  }
});

// Save quiz
quizForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const title = document.getElementById("quiz-title").value;
  const questions = [];
  
  // Get all question forms
  const questionForms = questionsContainer.querySelectorAll('.question-form');
  
  questionForms.forEach((form, index) => {
    const questionText = form.querySelector('.question-text').value;
    const optionInputs = form.querySelectorAll('.option-text');
    const correctOption = form.querySelector('.correct-option:checked').value;
    
    const options = [];
    optionInputs.forEach(input => {
      options.push(input.value);
    });
    
    questions.push({
      question: questionText,
      options: options,
      correctAnswer: parseInt(correctOption)
    });
  });
  
  // Save the quiz
  const newQuiz = {
    title: title,
    questions: questions,
    creator: currentUser.email
  };
  
  quizzes.push(newQuiz);
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
  
  alert('Quiz created successfully!');
  quizForm.reset();
  showDashboard();
});

// Render user quizzes
function renderUserQuizzes() {
  quizzesContainer.innerHTML = '';
  
  if (userQuizzes.length === 0) {
    quizzesContainer.innerHTML = '<p>You haven\'t created any quizzes yet.</p>';
    return;
  }
  
  userQuizzes.forEach((quiz, index) => {
    const quizElement = document.createElement('div');
    quizElement.classList.add('quiz-item');
    quizElement.innerHTML = `
      <div class="quiz-title">${quiz.title}</div>
      <div class="quiz-actions">
        <button class="take-quiz-btn" data-index="${index}">Take Quiz</button>
        <button class="delete-quiz-btn" data-index="${index}">Delete</button>
      </div>
    `;
    quizzesContainer.appendChild(quizElement);
  });
  
  // Add event listeners to the buttons
  document.querySelectorAll('.take-quiz-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      takeUserQuiz(index);
    });
  });
  
  document.querySelectorAll('.delete-quiz-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteUserQuiz(index);
    });
  });
}

function takeUserQuiz(index) {
  currentQuiz = userQuizzes[index].questions;
  currentIndex = 0;
  score = 0;
  dashboard.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  createQuizSection.classList.add("hidden");
  loadQuestion();
}

function deleteUserQuiz(index) {
  const quizTitle = userQuizzes[index].title;
  if (confirm(`Are you sure you want to delete the quiz "${quizTitle}"?`)) {
    // Remove from quizzes array
    const globalIndex = quizzes.findIndex(q => q.title === quizTitle && q.creator === currentUser.email);
    if (globalIndex !== -1) {
      quizzes.splice(globalIndex, 1);
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
    }
    
    // Update user quizzes and re-render
    userQuizzes = quizzes.filter(quiz => quiz.creator === currentUser.email);
    renderUserQuizzes();
  }
}

// -------------------- NAVBAR --------------------
dashboardBtn.addEventListener("click", showDashboard);
takeQuizBtn.addEventListener("click", startQuiz);
startQuizBtn.addEventListener("click", startQuiz);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
  authCard.classList.remove("hidden");
  dashboard.classList.add("hidden");
  quizContainer.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  createQuizSection.classList.add("hidden");
});

// Restart Quiz
restartBtn.addEventListener("click", () => {
  showDashboard();
});

// Initialize the application
init();

// -------------------- AUTO LOGIN --------------------
if (currentUser) {
  showDashboard();
}
