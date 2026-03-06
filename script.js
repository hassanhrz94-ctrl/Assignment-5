



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
