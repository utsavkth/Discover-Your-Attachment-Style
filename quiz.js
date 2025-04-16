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
    { text: "I often worry someone I like will lose interest, even if nothing’s wrong.", category: "A" },
    { text: "I can show affection and talk about feelings without much hesitation.", category: "B" },
    { text: "I sometimes hide parts of myself because I'm scared they’ll push people away.", category: "A" },
    { text: "After a breakup, I usually shut down and move on pretty fast.", category: "C" },
    { text: "Being single makes me feel like something’s missing or wrong with me.", category: "A" },
    { text: "I struggle to comfort people when they’re upset — it makes me uncomfortable.", category: "C" },
    { text: "If my partner doesn’t text back, I spiral into thoughts like 'They’ve lost interest.'", category: "A" },
    { text: "I feel okay relying on someone emotionally and letting them rely on me.", category: "B" },
    { text: "Sometimes I feel like closeness threatens my personal space.", category: "C" },
    { text: "Even in serious relationships, I hold back from sharing my deeper feelings.", category: "C" },
    { text: "If I open up emotionally, I worry I’ll come off as needy.", category: "A" },
    { text: "I generally feel secure and happy in my relationships.", category: "B" },
    { text: "I don’t create drama or overreact in relationships — I stay pretty steady.", category: "B" },
    { text: "My mind constantly analyzes the state of my relationship.", category: "A" },
    { text: "It’s hard for me to fully trust someone enough to depend on them.", category: "C" },
    { text: "I get emotionally attached to people very quickly — even early on.", category: "A" },
    { text: "It’s easy for me to express what I need from someone I'm close to.", category: "B" },
    { text: "Sometimes I feel annoyed with my partner but can’t figure out why.", category: "A" },
    { text: "If my partner’s mood shifts, I feel it immediately — almost like it's mine too.", category: "A" },
    { text: "I believe most people are reliable and honest at their core.", category: "B" },
    { text: "I’m more comfortable keeping things casual than going deep emotionally.", category: "C" },
    { text: "I don’t mind sharing what’s on my mind if I trust the other person.", category: "B" },
    { text: "The thought of losing someone I love makes me feel empty and scared.", category: "A" },
    { text: "When someone gets emotionally close, I feel the need to create distance.", category: "C" },
    { text: "Arguments can overwhelm me — I sometimes say things I don’t mean.", category: "A" },
    { text: "A disagreement doesn’t make me doubt the whole relationship.", category: "B" },
    { text: "People I’ve dated often say I seem emotionally unavailable.", category: "C" },
    { text: "Sometimes I don’t feel attractive or lovable enough to be wanted long-term.", category: "A" },
    { text: "I’m not into drama — I’d rather keep things calm and respectful.", category: "B" },
    { text: "I miss my partner, but at the same time, I pull back or act distant.", category: "C" },
    { text: "I can disagree with someone and still feel confident in the relationship.", category: "B" },
    { text: "When others depend on me emotionally, I feel trapped or pressured.", category: "C" },
    { text: "If someone I’m into flirts with others, I shrug it off — not a big deal.", category: "B" },
    { text: "If someone I like flirts with others, I weirdly feel relieved — less pressure.", category: "C" },
    { text: "If someone I like flirts with others, I feel unwanted or insecure.", category: "A" },
    { text: "If someone acts distant, I try not to take it personally — they might be going through something.", category: "B" },
    { text: "If someone grows distant, I emotionally check out — almost like I beat them to it.", category: "C" },
    { text: "If someone pulls away, I immediately think I did something wrong.", category: "A" },
    { text: "If someone leaves me, I obsess over proving they made a mistake.", category: "A" },
    { text: "If a relationship ends, I feel it — but I trust I’ll move on eventually.", category: "B" },
    { text: "Sometimes after chasing something (or someone), I lose interest once I have it.", category: "C" },
    { text: "I’m okay staying friends with an ex — as long as things ended respectfully.", category: "B" }
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
  const name = document.getElementById("username").value.trim();
  const gender = document.getElementById("gender").value;
  const relationship = document.getElementById("relationship").value;
  localStorage.setItem("userDetails", JSON.stringify({ name, gender, relationship }));
  formSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    div.className = "question fade-in";
    div.innerHTML = `
      <p>${q.text}</p>
      <label><input type="radio" name="q${questionIndex}" value="yes" ${answers[questionIndex] === "yes" ? "checked" : ""}> Yes</label>
      <label><input type="radio" name="q${questionIndex}" value="no" ${answers[questionIndex] === "no" ? "checked" : ""}> No</label>
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  const totalAnswered = Object.keys(answers).length;
  const percent = Math.round((totalAnswered / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
}
