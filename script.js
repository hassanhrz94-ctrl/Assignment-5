const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const loginBtn = document.getElementById('login-btn');
const loginPage = document.getElementById('login-page');
const mainDashboard = document.getElementById('main-dashboard');
const issuesGrid = document.getElementById('issues-grid');
const issueCountEl = document.getElementById('issue-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tabs = document.querySelectorAll('.filter-tab');

let allIssues = [];

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

// 2. Fetch Data
async function fetchIssues() {
    try {
        const response = await fetch(`${API_BASE}/issues`);
        const data = await response.json();
        allIssues = data.data; // Adjust based on actual API response structure
        renderIssues(allIssues);
    } catch (error) {
        console.error("Error fetching issues:", error);
    }
}

// 3. Render Issue Cards
function renderIssues(issues) {
    issuesGrid.innerHTML = '';
    issueCountEl.innerText = issues.length;

    issues.forEach(issue => {
        // Requirement: Green for Open, Purple for Closed top border
        const borderColor = issue.status.toLowerCase() === 'open' ? 'border-t-green-500' : 'border-t-purple-600';
        
        const card = document.createElement('div');
        card.className = `card bg-base-100 shadow-xl border-t-4 ${borderColor} cursor-pointer hover:scale-105 transition-transform`;
        card.innerHTML = `
            <div class="card-body p-5">
                <h2 class="card-title text-sm font-bold text-blue-600 hover:underline mb-2" onclick="showDetails('${issue._id}')">
                    ${issue.title}
                </h2>
                <p class="text-xs text-gray-500 line-clamp-2 mb-3">${issue.description}</p>
                
                <div class="flex flex-wrap gap-1 mb-4">
                    <span class="badge badge-sm">${issue.category}</span>
                    <span class="badge badge-sm badge-outline">${issue.label}</span>
                    <span class="badge badge-sm ${issue.priority === 'High' ? 'badge-error' : 'badge-warning'}">${issue.priority}</span>
                </div>
                
                <div class="border-t pt-3 text-[10px] text-gray-400">
                    <p>Author: <span class="text-gray-700 font-medium">${issue.author}</span></p>
                    <p>Created: ${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        issuesGrid.appendChild(card);
    });
}

// 4. Tab Filtering Logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');

        const status = tab.getAttribute('data-status');
        if (status === 'all') {
            renderIssues(allIssues);
        } else {
            const filtered = allIssues.filter(i => i.status.toLowerCase() === status);
            renderIssues(filtered);
        }
    });
});

// 5. Search Functionality
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value;
    if (!query) return renderIssues(allIssues);

    try {
        const response = await fetch(`${API_BASE}/issues/search?q=${query}`);
        const data = await response.json();
        renderIssues(data.data);
    } catch (error) {
        console.error("Search failed:", error);
    }
});

// 6. Modal / Details View
async function showDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/issue/${id}`);
        const data = await response.json();
        const issue = data.data;

        document.getElementById('modal-title').innerText = issue.title;
        document.getElementById('modal-content').innerHTML = `
            <p class="text-gray-700">${issue.description}</p>
            <div class="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-gray-50 rounded">
                <p><strong>Status:</strong> ${issue.status}</p>
                <p><strong>Category:</strong> ${issue.category}</p>
                <p><strong>Priority:</strong> ${issue.priority}</p>
                <p><strong>Label:</strong> ${issue.label}</p>
                <p><strong>Author:</strong> ${issue.author}</p>
                <p><strong>Created:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
            </div>
        `;
        document.getElementById('issue_modal').showModal();
    } catch (error) {
        console.error("Error loading details:", error);
    }
}