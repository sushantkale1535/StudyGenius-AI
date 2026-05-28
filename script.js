
// 1. GLOBAL API SETTINGS & REUSABLE ACCESS UTILITIES
const API_BASE_URL = "http://localhost:5000/api/study"; 

const getAuthToken = () => localStorage.getItem("studyGeniusToken");
const getActiveUser = () => JSON.parse(localStorage.getItem("studyGeniusUser"));
const getActiveSessionDocId = () => localStorage.getItem("activeStudySessionId");

// 2. DOM INITIALIZERS & DEFENSIVE ELEMENT SELECTORS
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

// Core UI Uploader Elements
const pdfInput = document.getElementById("pdfInput");
const selectedFileName = document.getElementById("selectedFileName");
const generateQuizBtn = document.getElementById("generateQuizBtn");
const generationLoader = document.getElementById("generationLoader");
const generationSuccess = document.getElementById("generationSuccess");

// Quiz Panel Elements
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

// Industrial Auth Panel Extensions
const nameFieldContainer = document.getElementById("nameFieldContainer");
const nameInput = document.getElementById("nameInput");
const authMainTitle = document.getElementById("authMainTitle");
const authSubText = document.getElementById("authSubText");
const authKicker = document.getElementById("authKicker");
const authBtnText = document.getElementById("authBtnText");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleAuthModeLink = document.getElementById("toggleAuthModeLink");
const toggleDisplayLabel = document.getElementById("toggleDisplayLabel");
const demoAccountsBox = document.getElementById("demoAccountsBox");

// Summary Dashboard Studio Elements
const summaryPdfInput = document.getElementById("summaryPdfInput");
const summaryFileName = document.getElementById("summaryFileName");
const generateSummaryPageBtn = document.getElementById("generateSummaryPageBtn");
const summaryPageLoader = document.getElementById("summaryPageLoader");
const summaryResultCard = document.getElementById("summaryResultCard");
const summaryPageText = document.getElementById("summaryPageText");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const historyList = document.getElementById("historyList");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = getActiveUser();
let quizData = JSON.parse(localStorage.getItem("activeQuizQuestionsArray")) || [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;
let currentQuizSource = localStorage.getItem("activeQuizSourceTitle") || "No Document Context Initialized";
let currentSessionDocId = getActiveSessionDocId();

let isSignUpMode = (nameFieldContainer && nameFieldContainer.style.display === "block") || false;


// 3. INDUSTRIAL REGISTRATION & SIGNIN CONTROLLER LAYER
if (toggleAuthModeLink) {
  toggleAuthModeLink.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    if (loginError) {
      loginError.style.display = "none";
      loginError.classList.remove("show");
    }
    if (loginForm) loginForm.reset();

    if (isSignUpMode) {
      if (nameFieldContainer) nameFieldContainer.style.display = "block";
      if (authMainTitle) authMainTitle.textContent = "Create an industrial account";
      if (authSubText) authSubText.textContent = "Sign up below to instantiate a persistent database study session workspace.";
      if (authKicker) authKicker.textContent = "New Registration";
      if (authBtnText) authBtnText.textContent = "Register Account";
      if (authSubmitBtn) authSubmitBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Register`;
      if (toggleDisplayLabel) toggleDisplayLabel.textContent = "Already have an account? ";
      if (toggleAuthModeLink) toggleAuthModeLink.textContent = "Sign In instead";
      if (demoAccountsBox) demoAccountsBox.style.display = "none";
    } else {
      if (nameFieldContainer) nameFieldContainer.style.display = "none";
      if (authMainTitle) authMainTitle.textContent = "Sign in to your study space";
      if (authSubText) authSubText.textContent = "Enter your credentials below to sync your active study sessions.";
      if (authKicker) authKicker.textContent = "Student Portal";
      if (authBtnText) authBtnText.textContent = "Login";
      if (authSubmitBtn) authSubmitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Login`;
      if (toggleDisplayLabel) toggleDisplayLabel.textContent = "Don't have an industrial account? ";
      if (toggleAuthModeLink) toggleAuthModeLink.textContent = "Create an Account";
      if (demoAccountsBox) demoAccountsBox.style.display = "block";
    }
  });
}

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (loginError) {
    loginError.style.display = "none";
    loginError.classList.remove("show");
  }

  const email = userIdInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput ? nameInput.value.trim() : "";

  if (!email || !password || (isSignUpMode && !name)) {
    displayAuthUiError("Please populate all credential input variables safely.");
    return;
  }

  const routeTarget = isSignUpMode ? "/auth/signup" : "/auth/login";
  
  try {
    if (authSubmitBtn) authSubmitBtn.disabled = true;
    
    const response = await fetch(`${API_BASE_URL}${routeTarget}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The server security subsystem rejected your access profile payload.");
    }

    // Persist real tokens into browser safe storage structures
    localStorage.setItem("studyGeniusToken", data.token);
    localStorage.setItem("studyGeniusUser", JSON.stringify(data.user));
    
    currentUser = data.user;

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("💥 System Authentication Exception:", err);
    displayAuthUiError(err.message);
  } finally {
    if (authSubmitBtn) authSubmitBtn.disabled = false;
  }
});

function displayAuthUiError(messageText) {
  if (!loginError) return;
  loginError.textContent = messageText;
  loginError.style.display = "block";
  loginError.classList.add("show");
}
// 4. ARCHITECTURAL STATE NAVIGATION ROUTER (DEFENSIVE BACKUPS)
function showPage(pageId) {
  if (pages.length === 0) return; 

  const protectedPages = ["page3", "page4", "page5", "page6"];
  if (protectedPages.includes(pageId) && !getAuthToken()) {
    window.location.href = "index.html";
    return;
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
    syncRunningDashboardStatsCounters();
  }
  if (pageId === "page5") renderCurrentQuestion();
  if (pageId === "page6") renderSummaryHistory();
}

function updateDashboardGreeting() {
  const user = getActiveUser();
  if (user && dashboardTitle && dashboardUserPill) {
    dashboardTitle.textContent = `Welcome back, ${user.name}`;
    dashboardUserPill.innerHTML = `<i class="fa-solid fa-user-astronaut"></i> ${user.name}`;
  }
}

function syncRunningDashboardStatsCounters() {
  const history = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
  const notesUploadedElement = document.querySelector(".stats-grid .stat-card:nth-child(1) strong");
  const quizzesGeneratedElement = document.querySelector(".stats-grid .stat-card:nth-child(2) strong");
  
  if (notesUploadedElement) notesUploadedElement.textContent = history.length || "0";
  if (quizzesGeneratedElement) quizzesGeneratedElement.textContent = getActiveSessionDocId() ? "1" : "0";
}


// 5. UNIFIED BINARY MULTI-PART PROCESSING HANDLERS

pdfInput?.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (file && selectedFileName) selectedFileName.textContent = file.name;
});

generateQuizBtn?.addEventListener("click", async () => {
  const file = pdfInput.files[0];
  if (!file) return alert("Please specify an input note document first.");

  generateQuizBtn.disabled = true;
  if (generationLoader) generationLoader.classList.add("show");
  if (generationSuccess) generationSuccess.classList.remove("show");

  const formData = new FormData();
  formData.append("pdf", file);

  const secureToken = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secureToken}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.quiz?.questions) {
      localStorage.setItem("activeStudySessionId", data._id);
      localStorage.setItem("activeQuizQuestionsArray", JSON.stringify(data.quiz.questions));
      localStorage.setItem("activeQuizSourceTitle", data.title || file.name);

      quizData = data.quiz.questions;
      currentQuizSource = data.title || file.name;
      currentSessionDocId = data._id;

      if (generationSuccess) generationSuccess.classList.add("show");
      if (quizGeneratedNotice) quizGeneratedNotice.classList.add("show");
      
      setTimeout(() => {
        window.location.href = "quiz.html";
      }, 800);
    } else {
      throw new Error(data.error || "Failed loading data structures from AI engine module.");
    }
  } catch (err) {
    console.error("💥 UI Engine Quiz Compilation failure:", err);
    alert(err.message || "Connection fault parsing assets against backend router clusters.");
  } finally {
    generateQuizBtn.disabled = false;
    if (generationLoader) generationLoader.classList.remove("show");
  }
});

// 6. MULTIPLE CHOICE EVALUATION DRIVER
function resetQuizState() {
  currentQuestionIndex = 0;
  score = 0;
  answerSelected = false;
  if (resultPanel) resultPanel.classList.remove("show");
  if (quizContent) quizContent.classList.remove("hidden");
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  if (!questionText || !optionsContainer) return;

  if (quizData.length === 0) {
    questionText.textContent = "No active document session parsed. Go to the upload tab to process a notes file context.";
    optionsContainer.innerHTML = "";
    return;
  }

  if (currentQuestionIndex >= quizData.length) { showFinalScore(); return; }
  const currentQuestion = quizData[currentQuestionIndex];
  answerSelected = false;
  
  if (nextQuestionBtn) {
    nextQuestionBtn.disabled = true;
    nextQuestionBtn.innerHTML = `<i class="fa-solid fa-forward"></i> Next Question`;
  }
  if (quizContent) quizContent.classList.remove("hidden");
  if (resultPanel) resultPanel.classList.remove("show");
  
  if (questionCounter) questionCounter.innerHTML = `<i class="fa-solid fa-list-ol"></i> Question ${currentQuestionIndex+1} of ${quizData.length}`;
  if (scoreDisplay) scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i> Score: ${score} / ${quizData.length}`;
  if (quizSource) quizSource.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${currentQuizSource}`;
  questionText.textContent = currentQuestion.question;
  if (progressFill) progressFill.style.width = `${(currentQuestionIndex/quizData.length)*100}%`;
  
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
    btn.addEventListener("click", () => selectAnswer(option, btn));
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(selectedOptionString, selectedButtonElement) {
  if (answerSelected) return;
  const currentQuestion = quizData[currentQuestionIndex];
  const buttons = optionsContainer.querySelectorAll(".option-btn");
  answerSelected = true;
  
  buttons.forEach(btn => {
    btn.disabled = true;
    const buttonText = btn.querySelector("span:nth-child(2)").textContent;
    if (buttonText === currentQuestion.answer) {
      btn.classList.add("correct");
    }
  });
  
  if (selectedOptionString === currentQuestion.answer) {
    score++;
  } else {
    selectedButtonElement.classList.add("wrong");
  }
  
  if (scoreDisplay) scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i> Score: ${score} / ${quizData.length}`;
  if (nextQuestionBtn) {
    nextQuestionBtn.disabled = false;
    if (currentQuestionIndex === quizData.length-1) nextQuestionBtn.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> View Results`;
  }
}

function showFinalScore() {
  if (quizContent) quizContent.classList.add("hidden");
  if (resultPanel) resultPanel.classList.add("show");
  if (progressFill) progressFill.style.width = "100%";
  if (questionCounter) questionCounter.innerHTML = `<i class="fa-solid fa-list-ol"></i> Completed`;
  if (scoreDisplay) scoreDisplay.innerHTML = `<i class="fa-solid fa-star"></i> Score: ${score} / ${quizData.length}`;
  
  const percent = Math.round((score/quizData.length)*100);
  if (finalScoreTitle) finalScoreTitle.textContent = `Final Score: ${score} / ${quizData.length} (${percent}%)`;
  if (finalScoreMessage) finalScoreMessage.textContent = "Excellent revision verification session metric output. Fire ad-hoc queries inside the Integrated AI Engine text tool workspace on the right.";
}

// 7. BACKEND CONNECTIONS - SUMMARIZER STUDIO
summaryPdfInput?.addEventListener("change", () => {
  const file = summaryPdfInput.files[0];
  if (file && summaryFileName) summaryFileName.textContent = file.name;
});

generateSummaryPageBtn?.addEventListener("click", async () => {
  const file = summaryPdfInput.files[0];
  if (!file) return alert("Please lock onto a target file component first.");

  generateSummaryPageBtn.disabled = true;
  if (summaryPageLoader) summaryPageLoader.classList.add("show");
  if (summaryResultCard) summaryResultCard.style.display = "none";

  const formData = new FormData();
  formData.append("pdf", file);

  const secureToken = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secureToken}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.summary) {
      if (summaryPageText) summaryPageText.textContent = data.summary;
      if (summaryResultCard) summaryResultCard.style.display = "block";
      currentSessionDocId = data._id;
      localStorage.setItem("activeStudySessionId", data._id);

      const history = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
      history.unshift({ text: data.summary, date: new Date().toLocaleString(), fileName: data.title || file.name });
      if (history.length > 10) history.pop();
      localStorage.setItem("summaryHistory", JSON.stringify(history));
      renderSummaryHistory();
    } else {
      throw new Error(data.error || "Failed assembling your document summary.");
    }
  } catch (err) {
    console.error("Summary execution layer crash:", err);
    alert("Could not process dynamic synthesis layers against server infrastructure.");
  } finally {
    generateSummaryPageBtn.disabled = false;
    if (summaryPageLoader) summaryPageLoader.classList.remove("show");
  }
});

function renderSummaryHistory() {
  if (!historyList) return;
  const history = JSON.parse(localStorage.getItem("summaryHistory") || "[]");
  if (history.length === 0) {
    historyList.innerHTML = "<p style='color:var(--muted)'>No historical summary cards generated yet.</p>";
    return;
  }
  historyList.innerHTML = history.map((item, idx) => `
    <div class="history-item" data-idx="${idx}">
      <strong>${escapeHtml(item.fileName)}</strong>
      <span class="history-date">${escapeHtml(item.date)}</span>
      <span class="history-summary">${escapeHtml(item.text.substring(0, 120))}...</span>
    </div>
  `).join("");

  document.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.idx, 10);
      const selected = history[idx];
      if (selected) {
        if (summaryPageText) summaryPageText.textContent = selected.text;
        if (summaryResultCard) {
          summaryResultCard.style.display = "block";
          summaryResultCard.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// 8. BACKEND CONNECTION: INTERACTIVE AI ENGINE QA MODULE
function modifyFlashcardToolToInteractiveQAEngine() {
  const asideTool = document.getElementById("notesFlashcardTool");
  if (!asideTool) return;

  asideTool.innerHTML = `
    <h3><i class="fa-solid fa-wand-magic-sparkles" style="color: #f97316;"></i> Integrated AI Engine</h3>
    <p class="section-copy">Challenge your current study session by typing natural language queries directly against your notes text layers.</p>
    <textarea id="aiEngineQuestionInput" placeholder="Ask anything: What are the core formulas? Can you explain active recall step-by-step from my file?"></textarea>
    <div class="button-row">
      <button id="submitEngineQuestionBtn" class="btn btn-coral"><i class="fa-solid fa-paper-plane"></i> Submit Query</button>
    </div>
    <p id="engineOutputMessage" class="flash-message" style="display:none; margin-top:12px;"></p>
    <div id="aiEngineResponseZone" style="margin-top: 15px; padding: 14px; background: white; border-radius:12px; font-size:0.9rem; line-height:1.5; max-height:250px; overflow-y:auto; border:1px solid #e2e8f0; display:none;"></div>
  `;

  const askBtn = document.getElementById("submitEngineQuestionBtn");
  const queryInput = document.getElementById("aiEngineQuestionInput");
  const responseZone = document.getElementById("aiEngineResponseZone");
  const outputMsg = document.getElementById("engineOutputMessage");

  askBtn.addEventListener("click", async () => {
    const questionText = queryInput.value.trim();
    const activeDocId = getActiveSessionDocId();

    if (!questionText) return alert("Please type an active question string first.");
    if (!activeDocId) return alert("Please process a workspace document via the Upload or Summary panel to map your AI engine workspace context.");

    askBtn.disabled = true;
    outputMsg.style.display = "block";
    outputMsg.textContent = "Searching document indexes context...";
    responseZone.style.display = "none";

    const secureToken = getAuthToken();

    try {
      const response = await fetch(`${API_BASE_URL}/ask-question`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secureToken}`
        },
        body: JSON.stringify({
          docId: activeDocId,
          question: questionText
        })
      });

      const data = await response.json();
      if (response.ok && data.answer) {
        outputMsg.style.display = "none";
        responseZone.style.display = "block";
        responseZone.innerHTML = `<strong>Answer Matrix Summary:</strong><p>${data.answer.replace(/\n/g, '<br>')}</p>`;
      } else {
        throw new Error(data.error || "Query evaluation failure.");
      }
    } catch (err) {
      outputMsg.textContent = "Failed to communicate with runtime vector evaluation layers.";
    } finally {
      askBtn.disabled = false;
    }
  });
}

// 9. CLIENT INTERCEPT LOGOUT & REGULAR AUTO-RUN BOOTSTRAPS
function escapeHtml(str) {
  return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m));
}

copySummaryBtn?.addEventListener("click", () => {
  if (summaryPageText) {
    navigator.clipboard.writeText(summaryPageText.textContent).then(() => {
      alert("Summary brief copied straight to structural clipboard matrix context!");
    });
  }
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("studyGeniusToken");
  localStorage.removeItem("studyGeniusUser");
  localStorage.removeItem("activeStudySessionId");
  localStorage.removeItem("activeQuizQuestionsArray");
  localStorage.removeItem("activeQuizSourceTitle");
  
  currentUser = null;
  quizData = [];
  currentQuizSource = "";
  currentSessionDocId = null;
  
  window.location.href = "auth.html";
});

// Universal Control Loop Event Bindings Defensive Attachments
getStartedBtn?.addEventListener("click", () => { window.location.href = "auth.html"; });
backToWelcomeLink?.addEventListener("click", (e) => { e.preventDefault(); window.location.href = "index.html"; });
goToUploadBtn?.addEventListener("click", () => { window.location.href = "upload.html"; });
goToQuizBtn?.addEventListener("click", () => { window.location.href = "quiz.html"; });
goToSummaryPageBtn?.addEventListener("click", () => { window.location.href = "summary.html"; });
backDashboardButtons.forEach(btn => btn.addEventListener("click", () => { window.location.href = "dashboard.html"; }));

nextQuestionBtn?.addEventListener("click", () => {
  currentQuestionIndex++;
  renderCurrentQuestion();
});
restartQuizBtn?.addEventListener("click", resetQuizState);
playAgainBtn?.addEventListener("click", resetQuizState);

focusFlashcardsBtn?.addEventListener("click", () => {
  const queryInput = document.getElementById("aiEngineQuestionInput");
  if(queryInput) {
    queryInput.scrollIntoView({ behavior: "smooth", block: "center" });
    queryInput.focus();
  }
});

// Carousel Dynamic Slide Automations
const slides = document.querySelectorAll(".carousel-slide");
if (slides.length) {
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 6000);
}

// Automated Session Verification on page mount
function verifySessionPersistenceOnLoad() {
  const token = getAuthToken();
  const user = localStorage.getItem("studyGeniusUser");
  const currentPath = window.location.pathname;

  if (token && user) {
    currentUser = JSON.parse(user);
    updateDashboardGreeting();
    renderSummaryHistory();
    syncRunningDashboardStatsCounters();
    
    if (currentPath.includes("quiz.html")) {
      renderCurrentQuestion();
    }
  } else {
    const isPrivate = ["dashboard.html", "upload.html", "quiz.html", "summary.html"].some(p => currentPath.includes(p));
    if (isPrivate) {
      window.location.href = "index.html";
    }
  }
}

// Initial execution directives on runtime loading
verifySessionPersistenceOnLoad();
modifyFlashcardToolToInteractiveQAEngine();