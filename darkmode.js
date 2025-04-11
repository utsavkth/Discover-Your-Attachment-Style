// js/darkmode.js — handles dark mode toggle

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("darkModeToggle");
    const html = document.documentElement;
  
    // Apply saved theme on load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      html.classList.add("dark");
    }
  
    // Toggle theme on click
    toggleBtn.addEventListener("click", () => {
      html.classList.toggle("dark");
      const newTheme = html.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
    });
  });
  