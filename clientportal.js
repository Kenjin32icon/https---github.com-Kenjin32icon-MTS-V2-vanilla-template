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
    // Modal functionality for Service Details
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const closeServiceModal = serviceDetailsModal ? serviceDetailsModal.querySelector('.close-modal') : null;
    const closeServiceBtn = serviceDetailsModal ? serviceDetailsModal.querySelector('.btn-close') : null;
    const viewServiceDetailsBtns = document.querySelectorAll('.view-details');

    if (serviceDetailsModal && viewServiceDetailsBtns.length > 0) {
        viewServiceDetailsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                serviceDetailsModal.style.display = 'flex';
                // Populate modal data here
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
