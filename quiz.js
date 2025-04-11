// js/quiz.js – handles the quiz logic, pagination, and progress

// === DOM Elements ===
const formSection = document.getElementById("introForm");
const quizSection = document.getElementById("quizSection");
const quizContainer = document.getElementById("quizContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressFill = document.getElementById("progressFill");

// Create and inject section header
const sectionHeader = document.createElement("div");
sectionHeader.id = "sectionHeader";
sectionHeader.className = "section-header";
quizSection.insertBefore(sectionHeader, quizContainer);

// === State ===
let currentPage = 0;
let answers = {};
const questionsPerPage = 5;

const questions = [
  // Section 1: How You Connect Emotionally
  { text: "I often wonder if the person I’m with might lose interest in me.", category: "A" },
  { text: "I find it easy to connect and show affection in my relationships.", category: "B" },
  { text: "I worry that if someone sees the real me, they might not stick around.", category: "A" },
  { text: "I bounce back pretty quickly from breakups — it’s like I switch off.", category: "C" },
  { text: "When I’m not in a relationship, I feel like something important is missing.", category: "A" },
  { text: "I struggle to be emotionally supportive when someone I care about is down.", category: "C" },
  { text: "If my partner is away, I start worrying they’ll lose interest in me.", category: "A" },
  { text: "Depending on someone emotionally feels okay to me.", category: "B" },
  { text: "My personal freedom often feels more important than romantic closeness.", category: "C" },
  { text: "I rarely open up about what I’m really feeling.", category: "C" },
  { text: "I worry that if I show my feelings, they won’t be returned.", category: "A" },
  { text: "Overall, I feel good about how my relationships go.", category: "B" },
  { text: "I don’t really act out or cause drama in my relationships.", category: "B" },
  { text: "I find myself thinking about my relationships way too much.", category: "A" },

  // Section 2: What You Need from Others
  { text: "It’s hard for me to fully rely on someone emotionally.", category: "C" },
  { text: "I get emotionally attached to someone really fast.", category: "A" },
  { text: "I don’t find it hard to speak up about what I need in relationships.", category: "B" },
  { text: "I can feel frustrated or irritated with my partner and not really know why.", category: "A" },
  { text: "I tend to pick up on my partner’s moods quickly — sometimes too much.", category: "A" },
  { text: "I generally believe that people are honest and dependable.", category: "B" },
  { text: "I’m more at ease keeping things casual than having deep emotional intimacy.", category: "C" },
  { text: "I’m okay with sharing my thoughts and emotions with someone I trust.", category: "B" },
  { text: "If my partner left me, I’d feel lost and wonder if I’ll ever find someone else.", category: "A" },
  { text: "I get nervous when someone wants to get really emotionally close to me.", category: "C" },
  { text: "When we argue, I can get so caught up in emotion that I say or do things I regret.", category: "A" },
  { text: "A disagreement doesn’t usually make me question the whole relationship.", category: "B" },
  { text: "People I’ve dated often want more closeness than I’m comfortable with.", category: "C" },
  { text: "Sometimes I don’t feel attractive enough to be truly wanted.", category: "A" },
  { text: "Some people might see me as boring, but I just don’t create much drama.", category: "B" },

  // Section 3: How You Respond to Conflict & Intimacy
  { text: "When I miss my partner, I sometimes also feel the urge to pull away.", category: "C" },
  { text: "I can express disagreement without feeling like I’ll be abandoned.", category: "B" },
  { text: "I don’t like it when others emotionally depend on me — it feels heavy.", category: "C" },
  { text: "If someone I’m into checks out others, I notice — but I don’t let it bother me for long.", category: "B" },
  { text: "If someone I’m seeing flirts with others, I actually feel relieved — less pressure for exclusivity.", category: "C" },
  { text: "If someone I like checks out others, it honestly makes me feel pretty down.", category: "A" },
  { text: "If someone I’m seeing pulls away, I can usually tell it’s not always about me.", category: "B" },
  { text: "If someone I’m dating grows distant, I tend to shut off — sometimes I’m even glad.", category: "C" },
  { text: "If someone starts acting distant, I assume I must’ve done something wrong.", category: "A" },
  { text: "If someone breaks up with me, I feel the need to prove they made a mistake.", category: "A" },
  { text: "If someone ends things after a few months, it’ll sting — but I know I’ll move on.", category: "B" },
  { text: "Sometimes when I finally get what I wanted, I’m not sure I want it anymore.", category: "C" },
  { text: "I’d have no problem staying in touch with an ex — especially if we got along well.", category: "B" }
];

const sections = [
  {
    start: 0,
    end: 13,
    title: "Section 1: How You Connect Emotionally",
    description: "Let’s start with how you usually show up in relationships. No right or wrong — just check what feels true."
  },
  {
    start: 14,
    end: 28,
    title: "Section 2: What You Need from Others",
    description: "This section dives into what you tend to seek, expect, or avoid emotionally in a relationship."
  },
  {
    start: 29,
    end: 42,
    title: "Section 3: How You Respond to Conflict & Intimacy",
    description: "Let’s wrap it up with how you respond to closeness, emotional tension, and relationship stress."
  }
];

const totalPages = Math.ceil(questions.length / questionsPerPage);

// === Events ===
document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    // Get user form values
    const name = document.getElementById("username").value.trim();
    const gender = document.getElementById("gender").value;
    const relationship = document.getElementById("relationship").value;
  
    // Save to localStorage to use later in result.html
    localStorage.setItem("userDetails", JSON.stringify({
      name,
      gender,
      relationship
    }));
  
    // Hide intro, show quiz
    formSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    renderQuestions();
  });
  

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderQuestions();
  } else {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    window.location.href = "result.html";
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderQuestions();
  }
});

// === Functions ===
function renderQuestions() {
  quizContainer.innerHTML = "";
  const start = currentPage * questionsPerPage;
  const end = start + questionsPerPage;
  const currentQuestions = questions.slice(start, end);

  const section = sections.find((s) => start >= s.start && start <= s.end);
  if (section) {
    sectionHeader.innerHTML = `
      <h2>${section.title}</h2>
      <p class="section-desc">${section.description}</p>
    `;
  }

  currentQuestions.forEach((q, index) => {
    const questionIndex = start + index;
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `
      <p>${q.text}</p>
      <label><input type="radio" name="q${questionIndex}" value="yes" ${
        answers[questionIndex] === "yes" ? "checked" : ""
      }> Yes</label>
      <label><input type="radio" name="q${questionIndex}" value="no" ${
        answers[questionIndex] === "no" ? "checked" : ""
      }> No</label>
    `;
    quizContainer.appendChild(div);
  });

  document.querySelectorAll(".question input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = parseInt(e.target.name.substring(1));
      answers[index] = e.target.value;
    });
  });

  updateProgress();
  prevBtn.style.display = currentPage === 0 ? "none" : "inline-block";
  nextBtn.textContent = currentPage === totalPages - 1 ? "See Results" : "Next";
}

function updateProgress() {
  const totalAnswered = Object.keys(answers).length;
  const percent = Math.round((totalAnswered / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
}
