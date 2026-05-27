const pages = document.querySelectorAll(".page");
const getStartedBtn = document.getElementById("getStartedBtn");
const backToWelcomeLink = document.getElementById("backToWelcomeLink");
const loginForm = document.getElementById("loginForm");
const userIdInput = document.getElementById("userIdInput");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardUserPill = document.getElementById("dashboardUserPill");
const goToUploadBtn = document.getElementById("goToUploadBtn");
const goToQuizBtn = document.getElementById("goToQuizBtn");
const backDashboardButtons = document.querySelectorAll(".backDashboardBtn");
const pdfInput = document.getElementById("pdfInput");
const selectedFileName = document.getElementById("selectedFileName");
const generateQuizBtn = document.getElementById("generateQuizBtn");
const generationLoader = document.getElementById("generationLoader");
const generationSuccess = document.getElementById("generationSuccess");
const quizGeneratedNotice = document.getElementById("quizGeneratedNotice");
const quizSource = document.getElementById("quizSource");
const questionCounter = document.getElementById("questionCounter");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const quizContent = document.getElementById("quizContent");
const resultPanel = document.getElementById("resultPanel");
const finalScoreTitle = document.getElementById("finalScoreTitle");
const finalScoreMessage = document.getElementById("finalScoreMessage");
const playAgainBtn = document.getElementById("playAgainBtn");
const focusFlashcardsBtn = document.getElementById("focusFlashcardsBtn");
const notesFlashcardTool = document.getElementById("notesFlashcardTool");
const notesInput = document.getElementById("notesInput");
const makeFlashcardsBtn = document.getElementById("makeFlashcardsBtn");
const flashcardMessage = document.getElementById("flashcardMessage");
const flashcardOutput = document.getElementById("flashcardOutput");

const defaultQuizData = [
  {
    question: "What is active recall?",
    options: [
      "Rereading notes until they feel familiar",
      "Testing yourself before looking at the answer",
      "Highlighting every important sentence",
      "Listening to a lecture at double speed"
    ],
    correctIndex: 1
  },
  {
    question: "Which habit best supports spaced repetition?",
    options: [
      "Reviewing all material only the night before",
      "Studying the easiest topics first every time",
      "Returning to information at planned intervals",
      "Copying notes without checking understanding"
    ],
    correctIndex: 2
  },
  {
    question: "Why are practice quizzes useful for studying?",
    options: [
      "They replace all reading and note-taking",
      "They make weak areas visible quickly",
      "They work only after perfect memorization",
      "They prevent the need for feedback"
    ],
    correctIndex: 1
  }
];

let storedUserId = "Demo Learner";
let quizData = [...defaultQuizData];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;
let currentQuizSource = "Default study skills";

function showPage(pageId) {
  pages.forEach((page) => {
    const isActive = page.id === pageId;
    page.classList.toggle("active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageId === "page3") {
    updateDashboardGreeting();
  }

  if (pageId === "page5") {
    renderCurrentQuestion();
  }
}

function updateDashboardGreeting() {
  dashboardTitle.textContent = `Welcome back, ${storedUserId}`;
  dashboardUserPill.innerHTML = `<i class="fa-solid fa-user-astronaut" aria-hidden="true"></i>${storedUserId}`;
}

function resetQuizState() {
  currentQuestionIndex = 0;
  score = 0;
  answerSelected = false;
  resultPanel.classList.remove("show");
  quizContent.classList.remove("hidden");
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    showFinalScore();
    return;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  answerSelected = false;
  nextQuestionBtn.disabled = true;
  nextQuestionBtn.innerHTML = `<i class="fa-solid fa-forward" aria-hidden="true"></i>Next Question`;
  quizContent.classList.remove("hidden");
  resultPanel.classList.remove("show");

  questionCounter.innerHTML = `<i class="fa-solid fa-list-ol" aria-hidden="true"></i>Question ${currentQuestionIndex + 1} of ${quizData.length}`;
  scoreDisplay.innerHTML = `<i class="fa-solid fa-star" aria-hidden="true"></i>Score: ${score} / ${quizData.length}`;
  quizSource.innerHTML = `<i class="fa-solid fa-layer-group" aria-hidden="true"></i>${currentQuizSource}`;
  questionText.textContent = currentQuestion.question;
  progressFill.style.width = `${(currentQuestionIndex / quizData.length) * 100}%`;

  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    const optionLetter = document.createElement("span");
    const optionText = document.createElement("span");

    optionButton.type = "button";
    optionButton.className = "option-btn";
    optionLetter.className = "option-letter";
    optionLetter.textContent = String.fromCharCode(65 + index);
    optionText.textContent = option;

    optionButton.append(optionLetter, optionText);
    optionButton.addEventListener("click", () => selectAnswer(index));
    optionsContainer.appendChild(optionButton);
  });
}

function selectAnswer(selectedIndex) {
  if (answerSelected) {
    return;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  answerSelected = true;

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === currentQuestion.correctIndex) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && selectedIndex !== currentQuestion.correctIndex) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === currentQuestion.correctIndex) {
    score += 1;
  }

  scoreDisplay.innerHTML = `<i class="fa-solid fa-star" aria-hidden="true"></i>Score: ${score} / ${quizData.length}`;
  nextQuestionBtn.disabled = false;

  if (currentQuestionIndex === quizData.length - 1) {
    nextQuestionBtn.innerHTML = `<i class="fa-solid fa-flag-checkered" aria-hidden="true"></i>View Results`;
  }
}

function showFinalScore() {
  const percent = Math.round((score / quizData.length) * 100);
  const message = percent >= 80
    ? "Strong work. Your recall is looking sharp."
    : percent >= 50
      ? "Nice progress. Review the missed ideas, then try again."
      : "Good start. A quick review pass will make the next run stronger.";

  quizContent.classList.add("hidden");
  resultPanel.classList.add("show");
  progressFill.style.width = "100%";
  questionCounter.innerHTML = `<i class="fa-solid fa-list-ol" aria-hidden="true"></i>Completed`;
  scoreDisplay.innerHTML = `<i class="fa-solid fa-star" aria-hidden="true"></i>Score: ${score} / ${quizData.length}`;
  finalScoreTitle.textContent = `Final Score: ${score} / ${quizData.length}`;
  finalScoreMessage.textContent = `${message} Use the notes-to-flashcards option here to turn key notes into quick review cards.`;
}

function buildGeneratedQuiz(fileName) {
  const tidyName = fileName.replace(/\.pdf$/i, "") || "your notes";

  return [
    {
      question: `For "${tidyName}", what should an AI flashcard focus on first?`,
      options: [
        "Decorative page colors",
        "Core ideas and testable facts",
        "The PDF file size only",
        "Unrelated trivia"
      ],
      correctIndex: 1
    },
    {
      question: "Which prompt helps StudyGenius create better quiz questions from notes?",
      options: [
        "Make everything vague",
        "Ignore definitions",
        "Turn key concepts into answerable questions",
        "Use only random dates"
      ],
      correctIndex: 2
    },
    {
      question: "What makes a flashcard effective for active recall?",
      options: [
        "A clear front question and a concise back answer",
        "A full textbook chapter on one side",
        "Only images with no meaning",
        "A question that has no answer"
      ],
      correctIndex: 0
    },
    {
      question: "When reviewing AI-generated flashcards, what should you do with weak cards?",
      options: [
        "Delete them immediately",
        "Guess once and never revisit",
        "Move them into shorter review intervals",
        "Hide the answer forever"
      ],
      correctIndex: 2
    },
    {
      question: "Which study strategy pairs best with a generated quiz?",
      options: [
        "Checking feedback after each attempt",
        "Avoiding mistakes at all costs",
        "Studying without breaks for an entire day",
        "Skipping every difficult question"
      ],
      correctIndex: 0
    }
  ];
}

function setGenerationLoading(isLoading) {
  generateQuizBtn.disabled = isLoading;
  generationLoader.classList.toggle("show", isLoading);
}

function handleQuizGeneration() {
  const selectedFile = pdfInput.files[0];

  if (!selectedFile) {
    alert("Please select a PDF file first.");
    return;
  }

  setGenerationLoading(true);
  generationSuccess.classList.remove("show");

  setTimeout(() => {
    quizData = buildGeneratedQuiz(selectedFile.name);
    currentQuizSource = `Generated from ${selectedFile.name}`;
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;
    generationSuccess.classList.add("show");
    quizGeneratedNotice.classList.add("show");
    quizGeneratedNotice.textContent = "✅ AI generated quiz from your notes!";
    setGenerationLoading(false);

    setTimeout(() => {
      showPage("page5");
    }, 450);
  }, 300);
}

function handleFileSelection() {
  const selectedFile = pdfInput.files[0];

  selectedFileName.classList.remove("error");
  generationSuccess.classList.remove("show");

  if (!selectedFile) {
    selectedFileName.textContent = "No PDF selected yet.";
    return;
  }

  const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    selectedFileName.textContent = "Only PDF files are supported.";
    selectedFileName.classList.add("error");
    pdfInput.value = "";
    return;
  }

  selectedFileName.textContent = selectedFile.name;
}

function createFlashcardsFromNotes() {
  const rawNotes = notesInput.value.trim();
  flashcardOutput.innerHTML = "";
  flashcardMessage.classList.remove("show", "error");

  if (!rawNotes) {
    flashcardMessage.textContent = "Add a few notes first.";
    flashcardMessage.classList.add("show", "error");
    return;
  }

  const sentences = rawNotes
    .split(/[\n.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 8)
    .slice(0, 4);

  const flashcards = sentences.length ? sentences : [rawNotes];

  flashcards.forEach((sentence, index) => {
    const row = document.createElement("div");
    const front = document.createElement("strong");
    const back = document.createElement("span");
    const shortAnswer = sentence.length > 150 ? `${sentence.slice(0, 147)}...` : sentence;

    row.className = "flashcard-row";
    front.textContent = `Flashcard ${index + 1}: What is the key idea?`;
    back.textContent = shortAnswer;
    row.append(front, back);
    flashcardOutput.appendChild(row);
  });

  flashcardMessage.textContent = "AI-style flashcards created from your notes.";
  flashcardMessage.classList.add("show");
}

getStartedBtn.addEventListener("click", () => showPage("page2"));

backToWelcomeLink.addEventListener("click", (event) => {
  event.preventDefault();
  showPage("page1");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredUserId = userIdInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  if (!enteredUserId || !enteredPassword) {
    loginError.classList.add("show");
    return;
  }

  storedUserId = enteredUserId;
  loginError.classList.remove("show");
  showPage("page3");
});

goToUploadBtn.addEventListener("click", () => showPage("page4"));
goToQuizBtn.addEventListener("click", () => showPage("page5"));
backDashboardButtons.forEach((button) => button.addEventListener("click", () => showPage("page3")));
pdfInput.addEventListener("change", handleFileSelection);
generateQuizBtn.addEventListener("click", handleQuizGeneration);

nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex += 1;

  if (currentQuestionIndex >= quizData.length) {
    showFinalScore();
    return;
  }

  renderCurrentQuestion();
});

restartQuizBtn.addEventListener("click", resetQuizState);
playAgainBtn.addEventListener("click", resetQuizState);
makeFlashcardsBtn.addEventListener("click", createFlashcardsFromNotes);

focusFlashcardsBtn.addEventListener("click", () => {
  notesFlashcardTool.scrollIntoView({ behavior: "smooth", block: "center" });
  notesInput.focus();
});

updateDashboardGreeting();
renderCurrentQuestion();
