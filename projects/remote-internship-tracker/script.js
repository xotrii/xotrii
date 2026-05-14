const STORAGE_KEY = 'xotriiRemoteInternshipTracker';

const defaultLeads = [
    {
        id: crypto.randomUUID(),
        company: 'Sample Studio',
        role: 'Front-End Intern',
        status: 'Saved',
        priority: 'High',
        action: 'Customize resume and submit portfolio link'
    },
    {
        id: crypto.randomUUID(),
        company: 'Remote Tech Lab',
        role: 'UI Developer Intern',
        status: 'Follow Up',
        priority: 'Medium',
        action: 'Send follow-up email this week'
    }
];

let leads = loadLeads();

const leadForm = document.querySelector('#leadForm');
const companyInput = document.querySelector('#companyInput');
const roleInput = document.querySelector('#roleInput');
const statusInput = document.querySelector('#statusInput');
const priorityInput = document.querySelector('#priorityInput');
const actionInput = document.querySelector('#actionInput');
const filterInput = document.querySelector('#filterInput');
const leadList = document.querySelector('#leadList');
const totalCount = document.querySelector('#totalCount');
const appliedCount = document.querySelector('#appliedCount');
const interviewCount = document.querySelector('#interviewCount');
const followUpCount = document.querySelector('#followUpCount');

function loadLeads() {
    const savedLeads = localStorage.getItem(STORAGE_KEY);

    if (!savedLeads) {
        return defaultLeads;
    }

    try {
        return JSON.parse(savedLeads);
    } catch (error) {
        console.error('Failed to load saved leads:', error);
        return defaultLeads;
    }
}

function saveLeads() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function getFilteredLeads() {
    const activeFilter = filterInput.value;

    if (activeFilter === 'All') {
        return leads;
    }

    return leads.filter((lead) => lead.status === activeFilter);
}

function updateStats() {
    totalCount.textContent = leads.length;
    appliedCount.textContent = leads.filter((lead) => lead.status === 'Applied').length;
    interviewCount.textContent = leads.filter((lead) => lead.status === 'Interview').length;
    followUpCount.textContent = leads.filter((lead) => lead.status === 'Follow Up').length;
}

function createLeadMarkup(lead) {
    return `
        <article class="lead-card">
            <div class="lead-card-top">
                <div>
                    <h3>${lead.company}</h3>
                    <p>${lead.role}</p>
                </div>
                <button class="delete-button" type="button" data-id="${lead.id}">Remove</button>
            </div>
            <div class="badges">
                <span class="badge">${lead.status}</span>
                <span class="badge">${lead.priority} Priority</span>
            </div>
            <p><strong>Next:</strong> ${lead.action || 'No next action added yet.'}</p>
        </article>
    `;
}

function renderLeads() {
    const filteredLeads = getFilteredLeads();

    if (filteredLeads.length === 0) {
        leadList.innerHTML = '<div class="empty-state">No opportunities match this filter yet.</div>';
    } else {
        leadList.innerHTML = filteredLeads.map(createLeadMarkup).join('');
    }

    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', () => {
            leads = leads.filter((lead) => lead.id !== button.dataset.id);
            saveLeads();
            renderLeads();
            updateStats();
        });
    });
}

leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newLead = {
        id: crypto.randomUUID(),
        company: companyInput.value.trim(),
        role: roleInput.value.trim(),
        status: statusInput.value,
        priority: priorityInput.value,
        action: actionInput.value.trim()
    };

    leads.unshift(newLead);
    saveLeads();
    leadForm.reset();
    renderLeads();
    updateStats();
});

filterInput.addEventListener('change', renderLeads);

renderLeads();
updateStats();
