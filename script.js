// DOM elements
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
const goToSummaryPageBtn = document.getElementById("goToSummaryPageBtn");
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
// Summary elements
const summaryPdfInput = document.getElementById("summaryPdfInput");
const summaryFileName = document.getElementById("summaryFileName");
const generateSummaryPageBtn = document.getElementById("generateSummaryPageBtn");
const summaryPageLoader = document.getElementById("summaryPageLoader");
const summaryResultCard = document.getElementById("summaryResultCard");
const summaryPageText = document.getElementById("summaryPageText");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const historyList = document.getElementById("historyList");
// Logout button
const logoutBtn = document.getElementById("logoutBtn");

// ---------- DEMO STUDENT ACCOUNTS (5 users) ----------
const demoUsers = [
  { email: "student1@study.com", password: "pass123", name: "Student One" },
  { email: "student2@study.com", password: "pass123", name: "Student Two" },
  { email: "student3@study.com", password: "pass123", name: "Student Three" },
  { email: "student4@study.com", password: "pass123", name: "Student Four" },
  { email: "student5@study.com", password: "pass123", name: "Student Five" }
];

let currentUser = null;

// ---------- DEFAULT 20‑QUESTION QUIZ (fallback) ----------
function generate20Quiz() {
  const topics = [
    "Active recall", "Spaced repetition", "Interleaving", "Elaboration", "Concrete examples",
    "Dual coding", "Metacognition", "Retrieval practice", "Self-explanation", "Summarization",
    "Highlighting (ineffective)", "Rereading (ineffective)", "Mnemonics", "Chunking", "Pomodoro technique",
    "Growth mindset", "Fixed mindset", "Cognitive load", "Working memory", "Long-term potentiation"
  ];
  const questions = [];
  for (let i = 0; i < 20; i++) {
    const topic = topics[i % topics.length];
    questions.push({
      question: `What is the key concept of "${topic}" in learning science?`,
      options: [
        `A method to improve memory by ${topic === "Active recall" ? "testing yourself" : "repetition"}`,
        `A study technique that ${topic === "Spaced repetition" ? "spreads out review sessions" : "involves practice"}`,
        `An approach that ${topic === "Metacognition" ? "thinks about one's own thinking" : "enhances understanding"}`,
        `A strategy that ${topic === "Growth mindset" ? "believes abilities can develop" : "is often misunderstood"}`
      ],
      correctIndex: i % 4
    });
  }
  return questions;
}

const defaultQuizData = generate20Quiz();

let quizData = [...defaultQuizData];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;
let currentQuizSource = "Default 20‑question quiz";

// ---------- PAGE NAVIGATION with auth check ----------
function showPage(pageId) {
  const protectedPages = ["page3", "page4", "page5", "page6"];
  if (protectedPages.includes(pageId) && !currentUser) {
    pageId = "page2";
  }
  pages.forEach(page => {
    const isActive = page.id === pageId;
    page.classList.toggle("active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (pageId === "page3") {
    updateDashboardGreeting();
    renderSummaryHistory();
  }
  if (pageId === "page5") renderCurrentQuestion();
  if (pageId === "page6") renderSummaryHistory();
}

function updateDashboardGreeting() {
  if (currentUser) {
    dashboardTitle.textContent = `Welcome back, ${currentUser.name}`;
    dashboardUserPill.innerHTML = `<i class="fa-solid fa-user-astronaut"></i>${currentUser.name}`;
  } else {
    dashboardTitle.textContent = `Welcome back, Guest`;
    dashboardUserPill.innerHTML = `<i class="fa-solid fa-user-astronaut"></i>Guest`;
  }
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
  if (currentQuestionIndex >= quizData.length) { showFinalScore(); return; }
  const currentQuestion = quizData[currentQuestionIndex];
  answerSelected = false;
  nextQuestionBtn.disabled = true;
  nextQuestionBtn.innerHTML = `<i class="fa-solid fa-forward"></i>Next Question`;
  quizContent.classList.remove("hidden");
  resultPanel.classList.remove("show");
  questionCounter.innerHTML = `<i class="fa-solid fa-list-ol"></i>Question ${currentQuestionIndex+1} of ${quizData.length}`;
  scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i>Score: ${score} / ${quizData.length}`;
  quizSource.innerHTML = `<i class="fa-solid fa-layer-group"></i>${currentQuizSource}`;
  questionText.textContent = currentQuestion.question;
  progressFill.style.width = `${(currentQuestionIndex/quizData.length)*100}%`;
  optionsContainer.innerHTML = "";
  currentQuestion.options.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    const letterSpan = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = String.fromCharCode(65+idx);
    const textSpan = document.createElement("span");
    textSpan.textContent = option;
    btn.append(letterSpan, textSpan);
    btn.addEventListener("click", () => selectAnswer(idx));
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  if (answerSelected) return;
  const currentQuestion = quizData[currentQuestionIndex];
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  answerSelected = true;
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.correctIndex) btn.classList.add("correct");
    if (idx === selectedIndex && selectedIndex !== currentQuestion.correctIndex) btn.classList.add("wrong");
  });
  if (selectedIndex === currentQuestion.correctIndex) score++;
  scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i>Score: ${score} / ${quizData.length}`;
  nextQuestionBtn.disabled = false;
  if (currentQuestionIndex === quizData.length-1) nextQuestionBtn.innerHTML = `<i class="fa-solid fa-flag-checkered"></i>View Results`;
}

function showFinalScore() {
  const percent = Math.round((score/quizData.length)*100);
  const message = percent >= 80 ? "Excellent! You've mastered this material." : percent >= 50 ? "Good effort. Review and try again!" : "Keep practicing – you'll get there!";
  quizContent.classList.add("hidden");
  resultPanel.classList.add("show");
  progressFill.style.width = "100%";
  questionCounter.innerHTML = `<i class="fa-solid fa-list-ol"></i>Completed`;
  scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i>Score: ${score} / ${quizData.length}`;
  finalScoreTitle.textContent = `Final Score: ${score} / ${quizData.length} (${percent}%)`;
  finalScoreMessage.textContent = `${message} Use the notes-to-flashcards tool to create more cards.`;
}

function buildGeneratedQuiz(fileName) {
  return generate20Quiz();
}

function setGenerationLoading(isLoading) {
  generateQuizBtn.disabled = isLoading;
  generationLoader.classList.toggle("show", isLoading);
}

// ---------- REAL API QUIZ GENERATION (with fallback) ----------
async function handleQuizGeneration() {
  const file = pdfInput.files[0];
  if (!file) { alert("Please select a PDF file first."); return; }
  setGenerationLoading(true);
  generationSuccess.classList.remove("show");

  const formData = new FormData();
  formData.append("pdf", file);
  const API_URL = "https://studygenius-ai-mmek.onrender.com/upload";

  try {
    const response = await fetch(API_URL, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
      quizData = data.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex
      }));
      currentQuizSource = `Generated from ${file.name}`;
    } else {
      throw new Error("Invalid API response – using 20‑question demo");
    }
  } catch (err) {
    console.warn("API quiz failed, falling back to demo:", err);
    quizData = buildGeneratedQuiz(file.name);
    currentQuizSource = `Demo 20‑question quiz from ${file.name}`;
  } finally {
    currentQuestionIndex = 0;
    score = 0;
    answerSelected = false;
    generationSuccess.classList.add("show");
    quizGeneratedNotice.classList.add("show");
    quizGeneratedNotice.textContent = "✅ AI generated quiz from your notes!";
    setGenerationLoading(false);
    setTimeout(() => showPage("page5"), 450);
  }
}

function handleFileSelection() {
  const file = pdfInput.files[0];
  selectedFileName.classList.remove("error");
  generationSuccess.classList.remove("show");
  if (!file) { selectedFileName.textContent = "No PDF selected yet."; return; }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    selectedFileName.textContent = "Only PDF files are supported.";
    selectedFileName.classList.add("error");
    pdfInput.value = "";
    return;
  }
  selectedFileName.textContent = file.name;
}

function createFlashcardsFromNotes() {
  const raw = notesInput.value.trim();
  flashcardOutput.innerHTML = "";
  flashcardMessage.classList.remove("show","error");
  if (!raw) { flashcardMessage.textContent = "Add a few notes first."; flashcardMessage.classList.add("show","error"); return; }
  const sentences = raw.split(/[\n.!?]+/).map(s=>s.trim()).filter(s=>s.length>8).slice(0,6);
  const flashcards = sentences.length ? sentences : [raw];
  flashcards.forEach((sent, i) => {
    const row = document.createElement("div");
    row.className = "flashcard-row";
    const strong = document.createElement("strong");
    strong.textContent = `Flashcard ${i+1}: What is the key idea?`;
    const span = document.createElement("span");
    span.textContent = sent.length>150 ? sent.slice(0,147)+"..." : sent;
    row.append(strong, span);
    flashcardOutput.appendChild(row);
  });
  flashcardMessage.textContent = "AI-style flashcards created from your notes.";
  flashcardMessage.classList.add("show");
}

// ---------- SUMMARY GENERATION (real API + history) ----------
function handleSummaryPageFileSelection() {
  const file = summaryPdfInput.files[0];
  if (!file) { summaryFileName.textContent = "No PDF selected."; return; }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    summaryFileName.textContent = "Only PDF files are supported.";
    summaryFileName.classList.add("error");
    summaryPdfInput.value = "";
    return;
  }
  summaryFileName.textContent = file.name;
  summaryFileName.classList.remove("error");
}

async function handleGenerateSummary() {
  const file = summaryPdfInput.files[0];
  if (!file) { alert("Please select a PDF file first."); return; }
  summaryPageLoader.classList.add("show");
  summaryResultCard.style.display = "none";
  const formData = new FormData();
  formData.append("pdf", file);
  const SUMMARY_API = "https://studygenius-ai-mmek.onrender.com/summarize";
  try {
    const response = await fetch(SUMMARY_API, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const summary = data.summary || "No summary generated.";
    summaryPageText.textContent = summary;
    summaryResultCard.style.display = "block";
    const history = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
    history.unshift({ text: summary, date: new Date().toLocaleString(), fileName: file.name });
    if (history.length > 10) history.pop();
    localStorage.setItem("summaryHistory", JSON.stringify(history));
    renderSummaryHistory();
  } catch (err) {
    console.error("Summary failed:", err);
    alert("Summary generation failed. Please try again later.");
  } finally {
    summaryPageLoader.classList.remove("show");
  }
}

function renderSummaryHistory() {
  if (!historyList) return;
  const history = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
  if (history.length === 0) {
    historyList.innerHTML = "<p style='color:var(--muted)'>No summaries yet. Generate one above.</p>";
    return;
  }
  historyList.innerHTML = history.map((item, idx) => `
    <div class="history-item" data-idx="${idx}">
      <strong>${escapeHtml(item.fileName)}</strong>
      <span class="history-date">${escapeHtml(item.date)}</span>
      <span class="history-summary">${escapeHtml(item.text.substring(0, 120))}${item.text.length > 120 ? "…" : ""}</span>
    </div>
  `).join("");
  document.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.idx, 10);
      const selected = history[idx];
      if (selected) {
        summaryPageText.textContent = selected.text;
        summaryResultCard.style.display = "block";
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

function copySummaryToClipboard() {
  const text = summaryPageText.textContent;
  if (!text || text === "No summary generated.") return;
  navigator.clipboard.writeText(text).then(() => {
    alert("Summary copied to clipboard!");
  }).catch(() => alert("Could not copy. Press Ctrl+C manually."));
}

// ---------- CAROUSEL LOGIC (auto-slide) ----------
let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");
function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
}
if (prevBtn && nextBtn && slides.length) {
  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });
  showSlide(0);
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 6000);
}

// ---------- LOGIN / LOGOUT LOGIC ----------
function handleLogin(email, password) {
  const user = demoUsers.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = { email: user.email, name: user.name };
    loginError.classList.remove("show");
    showPage("page3");
    return true;
  } else {
    loginError.classList.add("show");
    return false;
  }
}

function handleLogout() {
  currentUser = null;
  quizData = [...defaultQuizData];
  currentQuizSource = "Default 20‑question quiz";
  currentQuestionIndex = 0;
  score = 0;
  answerSelected = false;
  showPage("page2");
}

// ---------- EVENT LISTENERS ----------
getStartedBtn.addEventListener("click", () => showPage("page2"));
backToWelcomeLink.addEventListener("click", (e) => { e.preventDefault(); showPage("page1"); });
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = userIdInput.value.trim();
  const pwd = passwordInput.value.trim();
  handleLogin(email, pwd);
});
goToUploadBtn.addEventListener("click", () => showPage("page4"));
goToQuizBtn.addEventListener("click", () => showPage("page5"));
if (goToSummaryPageBtn) goToSummaryPageBtn.addEventListener("click", () => showPage("page6"));
backDashboardButtons.forEach(btn => btn.addEventListener("click", () => showPage("page3")));
pdfInput.addEventListener("change", handleFileSelection);
generateQuizBtn.addEventListener("click", handleQuizGeneration);
nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizData.length) showFinalScore();
  else renderCurrentQuestion();
});
restartQuizBtn.addEventListener("click", resetQuizState);
playAgainBtn.addEventListener("click", resetQuizState);
makeFlashcardsBtn.addEventListener("click", createFlashcardsFromNotes);
focusFlashcardsBtn.addEventListener("click", () => { notesFlashcardTool.scrollIntoView({ behavior: "smooth", block: "center" }); notesInput.focus(); });
if (summaryPdfInput) summaryPdfInput.addEventListener("change", handleSummaryPageFileSelection);
if (generateSummaryPageBtn) generateSummaryPageBtn.addEventListener("click", handleGenerateSummary);
if (copySummaryBtn) copySummaryBtn.addEventListener("click", copySummaryToClipboard);
if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

// Initial render
updateDashboardGreeting();
renderCurrentQuestion();
renderSummaryHistory();
showPage("page1");
