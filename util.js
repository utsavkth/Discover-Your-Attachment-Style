// util.js – Utility functions for quiz app

// Save username to localStorage
export function saveUsername(name) {
    localStorage.setItem('attachment_quiz_username', name);
  }
  
  // Get saved username
  export function getUsername() {
    return localStorage.getItem('attachment_quiz_username') || '';
  }
  
  // Save answers (object of { index: true })
  export function saveAnswers(answers) {
    localStorage.setItem('attachment_quiz_answers', JSON.stringify(answers));
  }
  
  // Get saved answers (returns object)
  export function getAnswers() {
    const saved = localStorage.getItem('attachment_quiz_answers');
    return saved ? JSON.parse(saved) : {};
  }
  
  // Clear quiz state (for Restart)
  export function clearQuizData() {
    localStorage.removeItem('attachment_quiz_username');
    localStorage.removeItem('attachment_quiz_answers');
  }