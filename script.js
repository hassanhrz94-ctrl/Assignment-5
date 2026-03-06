const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const loginBtn = document.getElementById('login-btn');
const loginPage = document.getElementById('login-page');
const mainDashboard = document.getElementById('main-dashboard');
const issuesGrid = document.getElementById('issues-grid');
const issueCountEl = document.getElementById('issue-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tabs = document.querySelectorAll('.filter-tab');

let allIssues = []



// 1. Authentication Logic
loginBtn.addEventListener('click', () => {
const user = document.getElementById('username').value;
 const pass = document.getElementById('password').value;
 if (user === 'admin' && pass === 'admin123') {
 loginPage.classList.add('hidden');
 mainDashboard.classList.remove('hidden');
 fetchIssues(); // Initial load
 } else {
 alert('Invalid credentials! Use admin / admin123');
 }
});
