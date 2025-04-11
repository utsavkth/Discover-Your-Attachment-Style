// js/result.js – processes answers and renders chart and description

window.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultContainer");
    const downloadBtn = document.getElementById("downloadBtn");
    const restartBtn = document.getElementById("restartBtn");
  
    // === Get stored user data ===
    const user = JSON.parse(localStorage.getItem("userDetails")) || {};
    const answers = JSON.parse(localStorage.getItem("quizAnswers")) || {};
    const scores = { A: 0, B: 0, C: 0 };
  
    Object.keys(answers).forEach((key) => {
      if (answers[key] === "yes") {
        const index = parseInt(key);
        const category = getCategory(index);
        scores[category]++;
      }
    });
  
    const maxScore = Math.max(...Object.values(scores));
    const type = Object.keys(scores).find((key) => scores[key] === maxScore);
  
    // === Attachment Style Descriptions ===
    const styleDescriptions = {
      A: "Anxious: You crave closeness but fear abandonment. Relationships often feel intense.",
      B: "Secure: You're emotionally balanced, open to connection, and communicate well.",
      C: "Avoidant: You value independence and may withdraw when things get too close."
    };
  
    const metaphors = {
      A: "like a radar always scanning for emotional signals ⚡",
      B: "like a tree rooted but open to sunlight 🔒",
      C: "like a cat — affectionate on your terms only 🐱"
    };
  
    // === Inject result text ===
    resultContainer.innerHTML = `
      <h2>${user.name || "You"}, here's your Attachment Style:</h2>
      <p><strong>${styleDescriptions[type]}</strong> You tend to be ${metaphors[type]}.</p>
      <p class="personal-note">Gender: ${user.gender || "—"} | Relationship Status: ${user.relationship || "—"}</p>
      <div class="chart-wrapper">
        <canvas id="resultChart" width="300" height="200"></canvas>
      </div>
    `;
  
    // === Chart rendering ===
    setTimeout(() => {
      const chartCanvas = document.getElementById("resultChart");
  
      if (!chartCanvas) return;
  
      new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: ["Anxious ⚡", "Secure 🔒", "Avoidant 🐱"],
          datasets: [{
            label: "Score",
            data: [scores.A, scores.B, scores.C],
            backgroundColor: ["#f87171", "#34d399", "#60a5fa"]
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }, 50);
  
    // === Retake Quiz button ===
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "quiz.html";
      });
    }
  
    // === Download PDF ===
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
          .then(() => import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"))
          .then(({ jsPDF }) => {
            html2canvas(document.body).then(canvas => {
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF();
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
              const width = canvas.width * ratio;
              const height = canvas.height * ratio;
  
              pdf.addImage(imgData, "PNG", 0, 0, width, height);
              pdf.save("Attachment_Style_Result.pdf");
            });
          });
      });
    }
  });
  
  // === Category mapping ===
  function getCategory(index) {
    const categories = [
      "A", "B", "A", "C", "A", "C", "A", "B", "C", "C", "A", "B", "B", "A",
      "C", "A", "B", "A", "A", "B", "C", "B", "A", "C", "A", "B", "C", "A", "B",
      "C", "B", "C", "B", "C", "A", "B", "C", "A", "A", "B", "C", "B"
    ];
    return categories[index] || "B";
  }
  