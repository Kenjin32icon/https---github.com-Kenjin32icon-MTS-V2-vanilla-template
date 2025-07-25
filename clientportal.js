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