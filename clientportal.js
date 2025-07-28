// Add to clientportal.html
document.addEventListener('DOMContentLoaded', () => {
    // Get client name from URL or authentication
    const urlParams = new URLSearchParams(window.location.search);
    const clientName = urlParams.get('client') || 'Valued Client';
    
    // Update welcome message
    document.querySelector('.client-info h3').textContent = `Welcome, ${clientName}!`;
    
    // Simulate data loading
    setTimeout(() => {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }, 1000);
});

// client.js (Specific JavaScript for clientportal.html)

document.addEventListener('DOMContentLoaded', () => {
    // Get client name from localStorage or default
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const clientName = loggedInUser && loggedInUser.role === 'client' ? loggedInUser.name : 'Valued Client';

    // Update welcome message
    // Ensure the element exists before trying to set textContent
    const clientInfoHeading = document.querySelector('.client-info .stat-label');
    if (clientInfoHeading) {
        clientInfoHeading.innerHTML = `<i class="fas fa-handshake"></i> Welcome, ${clientName}!`;
    }

    // Simulate data loading
    setTimeout(() => {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        const clientGeneratorsTable = document.getElementById('clientGeneratorsTable');
        if (clientGeneratorsTable) clientGeneratorsTable.style.display = 'table';
    }, 1000);

    // Modal functionality for Service Details
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const closeServiceModal = serviceDetailsModal ? serviceDetailsModal.querySelector('.close-modal') : null;
    const closeServiceBtn = serviceDetailsModal ? serviceDetailsModal.querySelector('.btn-close') : null;
    const viewServiceDetailsBtns = document.querySelectorAll('.view-details');

    if (serviceDetailsModal && viewServiceDetailsBtns.length > 0) {
        viewServiceDetailsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                serviceDetailsModal.style.display = 'flex';
                // Populate modal data here (this part remains conceptual for now)
            });
        });

        if (closeServiceModal) {
            closeServiceModal.addEventListener('click', () => {
                serviceDetailsModal.style.display = 'none';
            });
        }
        if (closeServiceBtn) {
            closeServiceBtn.addEventListener('click', () => {
                serviceDetailsModal.style.display = 'none';
            });
        }
        window.addEventListener('click', (e) => {
            if (e.target === serviceDetailsModal) {
                serviceDetailsModal.style.display = 'none';
            }
        });
    }
});
