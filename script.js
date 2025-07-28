// script.js (Existing content, with additions for team.html)
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeText = document.getElementById('darkModeText');

    // Function to update UI elements based on dark mode state
    const updateDarkModeUI = (isDark) => {
        if (darkModeIcon) darkModeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        if (darkModeText) darkModeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    };

    // Check for saved preference and apply
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    updateDarkModeUI(isDarkMode);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            updateDarkModeUI(isDark);
        });
    }

    // Initialize Chart.js (only if the element exists on the page)
    const ctx = document.getElementById('serviceTrendChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Number of Services',
                    data: [12, 19, 15, 25, 30, 22, 28],
                    backgroundColor: 'rgba(52, 152, 219, 1)',
                    borderColor: 'rgba(41, 128, 185, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Services'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                            }
                        }
                    }
                }
            }
        });
    }

    // Dropdown functionality
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });

        window.addEventListener('click', (event) => {
            if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown-menu')) {
                if (dropdownMenu.classList.contains('show')) {
                    dropdownMenu.classList.remove('show');
                }
            }
        });
    }

    // Mobile Menu functionality
    const menuButton = document.querySelector('.menu-button');
    const navContainer = document.querySelector('.nav-container'); // This is #main-nav

    if (menuButton && navContainer) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            navContainer.classList.toggle('active');
            // Also toggle the header-container visibility for mobile
            document.querySelector('.header-container').classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!menuButton.contains(event.target) && !navContainer.contains(event.target) && !document.querySelector('.header-container').contains(event.target)) {
                if (navContainer.classList.contains('active')) {
                    navContainer.classList.remove('active');
                    document.querySelector('.header-container').classList.remove('active');
                    menuButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Active Page Highlighting
    const currentPage = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    // Modal functionality (for service details, part details, generator details, and technician details)
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const partDetailsModal = document.getElementById('partDetailsModal');
    const generatorDetailsModal = document.getElementById('generatorDetailsModal');
    const technicianDetailsModal = document.getElementById('technicianDetailsModal'); // New modal for team.html

    // Generic modal open/close logic
    const setupModal = (modalElement) => {
        if (!modalElement) return;

        const closeButtons = modalElement.querySelectorAll('.close-modal, .btn-close');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modalElement.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                modalElement.style.display = 'none';
            }
        });
    };

    setupModal(serviceDetailsModal);
    setupModal(partDetailsModal);
    setupModal(generatorDetailsModal);
    setupModal(technicianDetailsModal); // Setup new modal

    // Attach event listeners for 'view-details' buttons
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Determine which modal to open based on the button's context
            if (btn.closest('#clientGeneratorsTable') || btn.closest('#recordsTable') || btn.closest('#scheduleGrid')) { // Added scheduleGrid for calendar events
                if (serviceDetailsModal) {
                    serviceDetailsModal.style.display = 'flex';
                    // Populate service details modal here based on data-id
                    // (This would need to be implemented to fetch/display data)
                }
            } else if (btn.closest('#partsTable')) {
                if (partDetailsModal) {
                    partDetailsModal.style.display = 'flex';
                    // Populate part details modal here based on data-id
                }
            } else if (btn.closest('#registryTable')) {
                if (generatorDetailsModal) {
                    generatorDetailsModal.style.display = 'flex';
                    // Populate generator details modal here based on data-id
                }
            } else if (btn.closest('#teamTable')) { // Added for team.html
                if (technicianDetailsModal) {
                    technicianDetailsModal.style.display = 'flex';
                    // Populate technician details modal here based on data-id
                }
            }
        });
    });


    // Table sorting functionality for client generators table (if present)
    const clientGeneratorsTable = document.getElementById('clientGeneratorsTable');
    if (clientGeneratorsTable) {
        const sortableHeaders = clientGeneratorsTable.querySelectorAll('.sortable');

        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                // Reset other headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Set current header
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the table (simulated)
                sortClientTable(sortBy, isAscending);
            });
        });

        // Filter functionality for client generators table
        const applyClientFiltersBtn = document.getElementById('applyClientFilters');
        const resetClientFiltersBtn = document.getElementById('resetClientFilters');

        if (applyClientFiltersBtn) {
            applyClientFiltersBtn.addEventListener('click', applyClientFilters);
        }
        if (resetClientFiltersBtn) {
            resetClientFiltersBtn.addEventListener('click', resetClientFilters);
        }

        function applyClientFilters() {
            const searchTerm = document.getElementById('clientGeneratorSearch').value.toLowerCase();
            const statusFilter = document.getElementById('clientGeneratorStatusFilter').value;
            const dateFrom = document.getElementById('clientDateFrom').value;
            const dateTo = document.getElementById('clientDateTo').value;

            const rows = clientGeneratorsTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const model = cells[0].textContent.toLowerCase();
                const serial = cells[1].textContent.toLowerCase();
                const lastServiceDate = cells[2].textContent;
                const statusCell = cells[4].querySelector('.status-badge');
                const status = statusCell ? statusCell.textContent.toLowerCase() : '';

                const matchesSearch = model.includes(searchTerm) || serial.includes(searchTerm);
                const matchesStatus = !statusFilter || status === statusFilter;
                const matchesDate = (!dateFrom || lastServiceDate >= dateFrom) && (!dateTo || lastServiceDate <= dateTo);

                row.style.display = matchesSearch && matchesStatus && matchesDate ? '' : 'none';
            });
        }

        function resetClientFilters() {
            document.getElementById('clientGeneratorSearch').value = '';
            document.getElementById('clientGeneratorStatusFilter').selectedIndex = 0;
            document.getElementById('clientDateFrom').value = '';
            document.getElementById('clientDateTo').value = '';

            const rows = clientGeneratorsTable.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }

        // Simulated table sorting for client generators
        function sortClientTable(column, ascending) {
            const rows = Array.from(clientGeneratorsTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aVal = a.children[getClientColumnIndex(column)].textContent;
                const bVal = b.children[getClientColumnIndex(column)].textContent;

                // For date columns
                if (column === 'lastService' || column === 'nextService') {
                    return ascending ?
                        new Date(aVal) - new Date(bVal) :
                        new Date(bVal) - new Date(aVal);
                }

                // For status column
                if (column === 'status') {
                    const statusOrder = {'completed': 1, 'pending': 2, 'overdue': 3};
                    return ascending ?
                        statusOrder[aVal.toLowerCase()] - statusOrder[bVal.toLowerCase()] :
                        statusOrder[bVal.toLowerCase()] - statusOrder[aVal.toLowerCase()];
                }

                // Default text comparison
                return ascending ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            });

            // Re-append rows in sorted order
            const tableBody = clientGeneratorsTable.querySelector('tbody');
            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        }

        function getClientColumnIndex(column) {
            const columns = ['model', 'serial', 'lastService', 'nextService', 'status'];
            return columns.indexOf(column);
        }

        // Loading indicator logic (from original clientportal.html)
        const loadingIndicator = document.getElementById('loading-indicator');

        if (loadingIndicator && clientGeneratorsTable) {
            // Simulate data loading
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                clientGeneratorsTable.style.display = 'table'; // Show the table
            }, 1500); // Adjust time as needed
        }
    }

    // Table sorting functionality for Parts Table (new for parts.html)
    const partsTable = document.getElementById('partsTable');
    if (partsTable) {
        const sortableHeaders = partsTable.querySelectorAll('.sortable');

        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                // Reset other headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Set current header
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the table (simulated)
                sortPartsTable(sortBy, isAscending);
            });
        });

        // Filter functionality for Parts Table
        const applyPartsFiltersBtn = document.getElementById('applyPartsFilters');
        const resetPartsFiltersBtn = document.getElementById('resetPartsFilters');

        if (applyPartsFiltersBtn) {
            applyPartsFiltersBtn.addEventListener('click', applyPartsFilters);
        }
        if (resetPartsFiltersBtn) {
            resetPartsFiltersBtn.addEventListener('click', resetPartsFilters);
        }

        function applyPartsFilters() {
            const searchTerm = document.getElementById('partSearch').value.toLowerCase();
            const categoryFilter = document.getElementById('partCategoryFilter').value;
            const stockStatusFilter = document.getElementById('partStockStatusFilter').value;

            const rows = partsTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const partName = cells[0].textContent.toLowerCase();
                const partNumber = cells[1].textContent.toLowerCase();
                const stockStatusCell = cells[4].querySelector('.status-badge');
                const stockStatus = stockStatusCell ? stockStatusCell.textContent.toLowerCase().replace(/\s/g, '-') : '';

                const matchesSearch = partName.includes(searchTerm) || partNumber.includes(searchTerm);
                const matchesStockStatus = !stockStatusFilter || stockStatus === stockStatusFilter;

                row.style.display = matchesSearch && matchesStockStatus ? '' : 'none';
            });
        }

        function resetPartsFilters() {
            document.getElementById('partSearch').value = '';
            document.getElementById('partCategoryFilter').selectedIndex = 0;
            document.getElementById('partStockStatusFilter').selectedIndex = 0;

            const rows = partsTable.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }

        // Simulated table sorting for Parts
        function sortPartsTable(column, ascending) {
            const rows = Array.from(partsTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aVal = a.children[getPartsColumnIndex(column)].textContent;
                const bVal = b.children[getPartsColumnIndex(column)].textContent;

                // For numeric columns (Quantity, Cost)
                if (column === 'quantity' || column === 'cost') {
                    const numA = parseFloat(aVal.replace(/[^0-9.-]+/g,""));
                    const numB = parseFloat(bVal.replace(/[^0-9.-]+/g,""));
                    return ascending ? numA - numB : numB - numA;
                }

                // For status column
                if (column === 'status') {
                    const statusOrder = {'in stock': 1, 'low stock': 2, 'out of stock': 3};
                    return ascending ?
                        statusOrder[aVal.toLowerCase()] - statusOrder[bVal.toLowerCase()] :
                        statusOrder[bVal.toLowerCase()] - statusOrder[aVal.toLowerCase()];
                }

                // Default text comparison
                return ascending ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            });

            // Re-append rows in sorted order
            const tableBody = partsTable.querySelector('tbody');
            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        }

        function getPartsColumnIndex(column) {
            const columns = ['name', 'number', 'quantity', 'cost', 'status'];
            return columns.indexOf(column);
        }
    }

    // Table sorting functionality for Records Table (new for records.html)
    const recordsTable = document.getElementById('recordsTable');
    if (recordsTable) {
        const sortableHeaders = recordsTable.querySelectorAll('.sortable');

        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                // Reset other headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Set current header
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the table (simulated)
                sortRecordsTable(sortBy, isAscending);
            });
        });

        // Filter functionality for Records Table
        const applyRecordsFiltersBtn = document.getElementById('applyRecordsFilters');
        const resetRecordsFiltersBtn = document.getElementById('resetRecordsFilters');

        if (applyRecordsFiltersBtn) {
            applyRecordsFiltersBtn.addEventListener('click', applyRecordsFilters);
        }
        if (resetRecordsFiltersBtn) {
            resetRecordsFiltersBtn.addEventListener('click', resetRecordsFilters);
        }

        function applyRecordsFilters() {
            const searchTerm = document.getElementById('recordSearch').value.toLowerCase();
            const statusFilter = document.getElementById('recordStatusFilter').value;
            const techFilter = document.getElementById('recordTechnicianFilter').value;
            const dateFrom = document.getElementById('recordDateFrom').value;
            const dateTo = document.getElementById('recordDateTo').value;

            const rows = recordsTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const serviceId = cells[0].textContent.toLowerCase();
                const generator = cells[1].textContent.toLowerCase();
                const serviceDate = cells[2].textContent;
                const technician = cells[4].textContent;
                const statusCell = cells[5].querySelector('.status-badge');
                const status = statusCell ? statusCell.textContent.toLowerCase() : '';

                const matchesSearch = serviceId.includes(searchTerm) || generator.includes(searchTerm) || technician.toLowerCase().includes(searchTerm);
                const matchesStatus = !statusFilter || status === statusFilter;
                const matchesTech = !techFilter || technician === techFilter;
                const matchesDate = (!dateFrom || serviceDate >= dateFrom) && (!dateTo || serviceDate <= dateTo);

                row.style.display = matchesSearch && matchesStatus && matchesTech && matchesDate ? '' : 'none';
            });
        }

        function resetRecordsFilters() {
            document.getElementById('recordSearch').value = '';
            document.getElementById('recordStatusFilter').selectedIndex = 0;
            document.getElementById('recordTechnicianFilter').selectedIndex = 0;
            document.getElementById('recordDateFrom').value = '';
            document.getElementById('recordDateTo').value = '';

            const rows = recordsTable.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }

        // Simulated table sorting for Records
        function sortRecordsTable(column, ascending) {
            const rows = Array.from(recordsTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aVal = a.children[getRecordsColumnIndex(column)].textContent;
                const bVal = b.children[getRecordsColumnIndex(column)].textContent;

                // For date columns
                if (column === 'date' || column === 'next') {
                    return ascending ?
                        new Date(aVal) - new Date(bVal) :
                        new Date(bVal) - new Date(aVal);
                }

                // For status column
                if (column === 'status') {
                    const statusOrder = {'completed': 1, 'pending': 2, 'overdue': 3};
                    return ascending ?
                        statusOrder[aVal.toLowerCase()] - statusOrder[bVal.toLowerCase()] :
                        statusOrder[bVal.toLowerCase()] - statusOrder[aVal.toLowerCase()];
                }

                // Default text comparison
                return ascending ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            });

            // Re-append rows in sorted order
            const tableBody = recordsTable.querySelector('tbody');
            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        }

        function getRecordsColumnIndex(column) {
            const columns = ['id', 'generator', 'date', 'next', 'tech', 'status'];
            return columns.indexOf(column);
        }
    }

    // Table sorting functionality for Registry Table (new for registry.html)
    const registryTable = document.getElementById('registryTable');
    if (registryTable) {
        const sortableHeaders = registryTable.querySelectorAll('.sortable');

        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                // Reset other headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Set current header
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the table (simulated)
                sortRegistryTable(sortBy, isAscending);
            });
        });

        // Filter functionality for Registry Table
        const applyRegistryFiltersBtn = document.getElementById('applyRegistryFilters');
        const resetRegistryFiltersBtn = document.getElementById('resetRegistryFilters');

        if (applyRegistryFiltersBtn) {
            applyRegistryFiltersBtn.addEventListener('click', applyRegistryFilters);
        }
        if (resetRegistryFiltersBtn) {
            resetRegistryFiltersBtn.addEventListener('click', resetRegistryFilters);
        }

        function applyRegistryFilters() {
            const searchTerm = document.getElementById('registrySearch').value.toLowerCase();
            const typeFilter = document.getElementById('registryTypeFilter').value;
            const locationFilter = document.getElementById('registryLocationFilter').value;
            const dateFrom = document.getElementById('registryDateFrom').value;
            const dateTo = document.getElementById('registryDateTo').value;

            const rows = registryTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const model = cells[0].textContent.toLowerCase();
                const serial = cells[2].textContent.toLowerCase();
                const type = cells[1].textContent;
                const location = cells[3].textContent;
                const purchaseDate = cells[4].textContent;

                const matchesSearch = model.includes(searchTerm) || serial.includes(searchTerm);
                const matchesType = !typeFilter || type === typeFilter;
                const matchesLocation = !locationFilter || location === locationFilter;
                const matchesDate = (!dateFrom || purchaseDate >= dateFrom) && (!dateTo || purchaseDate <= dateTo);

                row.style.display = matchesSearch && matchesType && matchesLocation && matchesDate ? '' : 'none';
            });
        }

        function resetRegistryFilters() {
            document.getElementById('registrySearch').value = '';
            document.getElementById('registryTypeFilter').selectedIndex = 0;
            document.getElementById('registryLocationFilter').selectedIndex = 0;
            document.getElementById('registryDateFrom').value = '';
            document.getElementById('registryDateTo').value = '';

            const rows = registryTable.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }

        // Simulated table sorting for Registry
        function sortRegistryTable(column, ascending) {
            const rows = Array.from(registryTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aVal = a.children[getRegistryColumnIndex(column)].textContent;
                const bVal = b.children[getRegistryColumnIndex(column)].textContent;

                // For date columns
                if (column === 'purchaseDate') {
                    return ascending ?
                        new Date(aVal) - new Date(bVal) :
                        new Date(bVal) - new Date(aVal);
                }

                // Default text comparison
                return ascending ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            });

            // Re-append rows in sorted order
            const tableBody = registryTable.querySelector('tbody');
            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        }

        function getRegistryColumnIndex(column) {
            const columns = ['model', 'type', 'serial', 'location', 'purchaseDate'];
            return columns.indexOf(column);
        }
    }

    // Table sorting functionality for Team Table (new for team.html)
    const teamTable = document.getElementById('teamTable');
    if (teamTable) {
        const sortableHeaders = teamTable.querySelectorAll('.sortable');

        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                // Reset other headers
                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Set current header
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the table (simulated)
                sortTeamTable(sortBy, isAscending);
            });
        });

        // Filter functionality for Team Table
        const applyTeamFiltersBtn = document.getElementById('applyTeamFilters');
        const resetTeamFiltersBtn = document.getElementById('resetTeamFilters');

        if (applyTeamFiltersBtn) {
            applyTeamFiltersBtn.addEventListener('click', applyTeamFilters);
        }
        if (resetTeamFiltersBtn) {
            resetTeamFiltersBtn.addEventListener('click', resetTeamFilters);
        }

        function applyTeamFilters() {
            const searchTerm = document.getElementById('teamSearch').value.toLowerCase();
            const roleFilter = document.getElementById('teamRoleFilter').value;
            const statusFilter = document.getElementById('teamStatusFilter').value;

            const rows = teamTable.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const name = cells[0].textContent.toLowerCase();
                const email = cells[1].textContent.toLowerCase();
                const role = cells[3].textContent;
                const statusCell = cells[5].querySelector('.status-badge');
                const status = statusCell ? statusCell.textContent : '';

                const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
                const matchesRole = !roleFilter || role === roleFilter;
                const matchesStatus = !statusFilter || status === statusFilter;

                row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
            });
        }

        function resetTeamFilters() {
            document.getElementById('teamSearch').value = '';
            document.getElementById('teamRoleFilter').selectedIndex = 0;
            document.getElementById('teamStatusFilter').selectedIndex = 0;

            const rows = teamTable.querySelectorAll('tbody tr');
            rows.forEach(row => row.style.display = '');
        }

        // Simulated table sorting for Team
        function sortTeamTable(column, ascending) {
            const rows = Array.from(teamTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aVal = a.children[getTeamColumnIndex(column)].textContent;
                const bVal = b.children[getTeamColumnIndex(column)].textContent;

                // For numeric columns (Assigned Services)
                if (column === 'assignedServices') {
                    const numA = parseInt(aVal);
                    const numB = parseInt(bVal);
                    return ascending ? numA - numB : numB - numA;
                }

                // For status column
                if (column === 'status') {
                    const statusOrder = {'Active': 1, 'Inactive': 2};
                    return ascending ?
                        statusOrder[aVal] - statusOrder[bVal] :
                        statusOrder[bVal] - statusOrder[aVal];
                }

                // Default text comparison
                return ascending ?
                    aVal.localeCompare(bVal) :
                    bVal.localeCompare(aVal);
            });

            // Re-append rows in sorted order
            const tableBody = teamTable.querySelector('tbody');
            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        }

        function getTeamColumnIndex(column) {
            const columns = ['name', 'email', 'phone', 'role', 'assignedServices', 'status'];
            return columns.indexOf(column);
        }
    }
});
