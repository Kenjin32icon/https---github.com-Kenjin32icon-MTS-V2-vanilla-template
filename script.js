// script.js (Combined and Cleaned)
import { users, services, parts, generators, technicians, rolePermissions } from './Thought process/data.js';

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

    // Generic Modal Setup and Population
    const setupModal = (modalElement) => {
        if (!modalElement) return;

        const closeButtons = modalElement.querySelectorAll('.close-modal, .btn-close');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modalElement.style.display = 'none';
                // Reset form sections when modal closes if it's an add/edit form
                const form = modalElement.querySelector('form');
                if (form) {
                    form.reset();
                    const firstSectionId = form.querySelector('.form-section')?.id.replace('section-', '');
                    if (firstSectionId) {
                        if (modalElement.id === 'addGeneratorModal') showMultiStepFormSection(modalElement, 'basic');
                        if (modalElement.id === 'addPartModal') showMultiStepFormSection(modalElement, 'basic-part');
                        if (modalElement.id === 'addTechnicianModal') showMultiStepFormSection(modalElement, 'personal');
                        if (modalElement.id === 'addServiceModal') showMultiStepFormSection(modalElement, 'service-info');
                    }
                }
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                modalElement.style.display = 'none';
                const form = modalElement.querySelector('form');
                if (form) {
                    form.reset();
                    const firstSectionId = form.querySelector('.form-section')?.id.replace('section-', '');
                    if (firstSectionId) {
                        if (modalElement.id === 'addGeneratorModal') showMultiStepFormSection(modalElement, 'basic');
                        if (modalElement.id === 'addPartModal') showMultiStepFormSection(modalElement, 'basic-part');
                        if (modalElement.id === 'addTechnicianModal') showMultiStepFormSection(modalElement, 'personal');
                        if (modalElement.id === 'addServiceModal') showMultiStepFormSection(modalElement, 'service-info');
                    }
                }
            }
        });
    };

    // Function to populate modal with data based on data-key attributes
    const populateModal = (modalElement, data) => {
        if (!modalElement || !data) return;

        // Iterate over all elements with data-key inside the modal
        modalElement.querySelectorAll('[data-key]').forEach(element => {
            const key = element.dataset.key;
            let value = data[key];

            if (value !== undefined) {
                // Handle special cases for display
                if (element.classList.contains('status-badge')) {
                    element.className = `status-badge status-${value.toLowerCase().replace(/\s/g, '-')}`;
                    element.textContent = value;
                } else if (key === 'partsUsed' && Array.isArray(value)) {
                    const partsListUl = element; // This element should be the <ul>
                    partsListUl.innerHTML = ''; // Clear previous list
                    if (value.length > 0) {
                        value.forEach(part => {
                            const li = document.createElement('li');
                            li.innerHTML = `<span>${part.name} - ${part.partNo}</span><span>${part.qty} × $${part.unitCost.toFixed(2)} = $${(part.qty * part.unitCost).toFixed(2)}</span>`;
                            partsListUl.appendChild(li);
                        });
                    } else {
                        partsListUl.innerHTML = '<li>No parts used.</li>';
                    }
                } else if (key === 'notes' || key === 'description' || key === 'certifications' || key === 'specialties') {
                    element.textContent = value || 'N/A';
                }
                else {
                    element.textContent = value;
                }
            } else {
                element.textContent = 'N/A'; // Default for missing data
            }
        });

        // Special handling for admin permissions modal
        if (modalElement.id === 'editUserRoleModal') {
            const roleSelect = modalElement.querySelector('#editUserRole');
            if (roleSelect) {
                roleSelect.value = data.role;
                updatePermissionsDisplay(roleSelect.value, modalElement);
            }
            modalElement.dataset.editingUserId = data.id; // Store ID for saving changes
        }
    };

    // Update permissions display based on selected role in Admin modal
    const updatePermissionsDisplay = (role, modalElement) => {
        const permissions = rolePermissions[role] || {};
        const permissionsGrid = modalElement.querySelector('.permissions-grid');
        if (!permissionsGrid) return;

        // Reset checkboxes and labels
        permissionsGrid.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false; // Uncheck all by default
            checkbox.disabled = true; // Disable all by default
        });

        // Set permissions based on role
        // This part needs to be more dynamic if permissions are not just 'view'/'manage'/'hidden'
        // For simplicity, we'll just check if a permission exists and mark the checkbox
        // and update the label if a specific display is needed.
        // The current HTML uses fixed checkboxes, so we'll just enable/disable them.

        // Example: Dashboard access is always checked and disabled
        const permDashboard = permissionsGrid.querySelector('#permDashboard');
        if (permDashboard) permDashboard.checked = true; // Always checked

        const permReports = permissionsGrid.querySelector('#permReports');
        if (permReports) permReports.checked = permissions.reports === 'view' || permissions.reports === 'manage';

        const permAdmin = permissionsGrid.querySelector('#permAdmin');
        if (permAdmin) permAdmin.checked = permissions.admin === 'manage';

        const permClientPortal = permissionsGrid.querySelector('#permClientPortal');
        if (permClientPortal) permClientPortal.checked = permissions.clientportal === 'view';

        // Update access status dropdown
        const userAccessStatus = modalElement.querySelector('#userAccessStatus');
        if (userAccessStatus) {
            userAccessStatus.value = data.status || 'active'; // Use actual user status
        }
    };


    // Initialize all modals
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');
    const partDetailsModal = document.getElementById('partDetailsModal');
    const generatorDetailsModal = document.getElementById('generatorDetailsModal');
    const technicianDetailsModal = document.getElementById('technicianDetailsModal');
    const addGeneratorModal = document.getElementById('addGeneratorModal');
    const addPartModal = document.getElementById('addPartModal');
    const addTechnicianModal = document.getElementById('addTechnicianModal');
    const editUserRoleModal = document.getElementById('editUserRoleModal');
    const addNewUserModal = document.getElementById('addNewUserModal');
    const addServiceModal = document.getElementById('addServiceModal'); // From schedule.html

    [serviceDetailsModal, partDetailsModal, generatorDetailsModal, technicianDetailsModal,
     addGeneratorModal, addPartModal, addTechnicianModal, editUserRoleModal, addNewUserModal, addServiceModal]
        .forEach(modal => setupModal(modal));

    // Attach event listeners for 'view-details' buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.id;
            let dataItem = null;
            let modalToOpen = null;

            if (e.currentTarget.closest('#clientGeneratorsTable') || e.currentTarget.closest('#recordsTable')) {
                dataItem = services.find(s => s.id === itemId);
                modalToOpen = serviceDetailsModal;
            } else if (e.currentTarget.closest('#partsTable')) {
                dataItem = parts.find(p => p.id === itemId);
                modalToOpen = partDetailsModal;
            } else if (e.currentTarget.closest('#registryTable')) {
                dataItem = generators.find(g => g.id === itemId);
                modalToOpen = generatorDetailsModal;
            } else if (e.currentTarget.closest('#teamTable')) {
                dataItem = technicians.find(t => t.id === itemId);
                modalToOpen = technicianDetailsModal;
            } else if (e.currentTarget.closest('#userManagementTable')) { // For admin.html
                dataItem = users.find(u => u.id === itemId);
                modalToOpen = editUserRoleModal; // Or a dedicated user details modal
            } else if (e.currentTarget.closest('.calendar-day')) { // For schedule.html calendar events
                dataItem = services.find(s => s.id === itemId); // Assuming services array contains schedule data
                modalToOpen = serviceDetailsModal;
            }

            if (dataItem && modalToOpen) {
                populateModal(modalToOpen, dataItem);
                modalToOpen.style.display = 'flex';
            }
        });
    });

    // Generic Multi-step Form Navigation Logic
    const setupMultiStepForm = (modalId, initialSectionId, dataArray, renderTableCallback) => {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) return;

        const formSections = modalElement.querySelectorAll('.form-section');
        const navTabs = modalElement.querySelectorAll('.nav-tab');
        const prevBtn = modalElement.querySelector('[id^="prev"][id$="SectionBtn"]');
        const nextBtn = modalElement.querySelector('[id^="next"][id$="SectionBtn"]');
        const submitBtn = modalElement.querySelector('[id^="submitNew"][id$="FormBtn"]');
        const form = modalElement.querySelector('form');

        let currentSectionIndex = 0;

        const showSection = (sectionId) => {
            formSections.forEach(section => {
                section.classList.remove('active');
            });
            navTabs.forEach(tab => {
                tab.classList.remove('active');
            });

            const targetSection = document.getElementById(`section-${sectionId}`);
            if (targetSection) {
                targetSection.classList.add('active');
                const targetTabIndex = Array.from(formSections).indexOf(targetSection);
                if (navTabs[targetTabIndex]) {
                    navTabs[targetTabIndex].classList.add('active');
                }
                currentSectionIndex = targetTabIndex;
                updateNavButtons();
            }
        };

        const updateNavButtons = () => {
            if (prevBtn) prevBtn.style.display = currentSectionIndex === 0 ? 'none' : 'inline-flex';
            if (nextBtn) nextBtn.style.display = currentSectionIndex === formSections.length - 1 ? 'none' : 'inline-flex';
            if (submitBtn) submitBtn.style.display = currentSectionIndex === formSections.length - 1 ? 'inline-flex' : 'none';
        };

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.dataset.section;
                showSection(sectionId);
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                    showSection(formSections[currentSectionIndex].id.replace('section-', ''));
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Optional: Add validation here before moving to next section
                if (currentSectionIndex < formSections.length - 1) {
                    currentSectionIndex++;
                    showSection(formSections[currentSectionIndex].id.replace('section-', ''));
                }
            });
        }

        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const newItem = {};
                for (let [key, value] of formData.entries()) {
                    newItem[key] = value;
                }

                // Simple ID generation (needs to be more robust in real app)
                if (!newItem.id) {
                    newItem.id = `${modalId.replace('add', '').replace('Modal', '').toLowerCase()}-${(dataArray.length + 1).toString().padStart(3, '0')}`;
                }

                dataArray.push(newItem); // Add to the respective data array
                renderTableCallback(); // Re-render the table
                modalElement.style.display = 'none';
                form.reset();
                showSection(initialSectionId); // Reset to first section
                alert(`New ${modalId.replace('add', '').replace('Modal', '')} added successfully! (Simulated)`);
            });
        }

        // Initial state for buttons when modal opens
        modalElement.addEventListener('click', (e) => { // Use click on modal to ensure it's open
            if (e.target === modalElement || e.target.closest('.close-modal') || e.target.closest('.btn-close')) {
                // Do nothing, handled by setupModal
            } else if (modalElement.style.display === 'flex') { // Only update if modal is actually open
                updateNavButtons();
            }
        });
    };

    // Helper function to get form data for multi-step forms
    const getFormData = (formId) => {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    };

    // Event listeners for "Add New" buttons
    const addNewGeneratorBtn = document.getElementById('addNewGeneratorBtn');
    if (addNewGeneratorBtn) {
        addNewGeneratorBtn.addEventListener('click', () => {
            if (addGeneratorModal) {
                addGeneratorModal.style.display = 'flex';
                // Initial setup for multi-step form
                setupMultiStepForm('addGeneratorModal', 'basic', generators, () => renderRegistryTable(generators));
                // Manually trigger showSection for the first section
                addGeneratorModal.querySelector('.form-section').classList.add('active');
                addGeneratorModal.querySelector('.nav-tab').classList.add('active');
                addGeneratorModal.querySelector('[id^="prev"][id$="SectionBtn"]').style.display = 'none';
                addGeneratorModal.querySelector('[id^="next"][id$="SectionBtn"]').style.display = 'inline-flex';
                addGeneratorModal.querySelector('[id^="submitNew"][id$="FormBtn"]').style.display = 'none';
            }
        });
    }

    const addNewPartBtn = document.getElementById('addNewPartBtn');
    if (addNewPartBtn) {
        addNewPartBtn.addEventListener('click', () => {
            if (addPartModal) {
                addPartModal.style.display = 'flex';
                setupMultiStepForm('addPartModal', 'basic-part', parts, () => renderPartsTable(parts));
                addPartModal.querySelector('.form-section').classList.add('active');
                addPartModal.querySelector('.nav-tab').classList.add('active');
                addPartModal.querySelector('[id^="prev"][id$="SectionBtn"]').style.display = 'none';
                addPartModal.querySelector('[id^="next"][id$="SectionBtn"]').style.display = 'inline-flex';
                addPartModal.querySelector('[id^="submitNew"][id$="FormBtn"]').style.display = 'none';
            }
        });
    }

    const addNewTechnicianBtn = document.getElementById('addNewTechnicianBtn');
    if (addNewTechnicianBtn) {
        addNewTechnicianBtn.addEventListener('click', () => {
            if (addTechnicianModal) {
                addTechnicianModal.style.display = 'flex';
                setupMultiStepForm('addTechnicianModal', 'personal', technicians, () => renderTeamTable(technicians));
                addTechnicianModal.querySelector('.form-section').classList.add('active');
                addTechnicianModal.querySelector('.nav-tab').classList.add('active');
                addTechnicianModal.querySelector('[id^="prev"][id$="SectionBtn"]').style.display = 'none';
                addTechnicianModal.querySelector('[id^="next"][id$="SectionBtn"]').style.display = 'inline-flex';
                addTechnicianModal.querySelector('[id^="submitNew"][id$="FormBtn"]').style.display = 'none';
            }
        });
    }

    const addNewUserBtn = document.getElementById('addNewUserBtn'); // From admin.html
    if (addNewUserBtn) {
        addNewUserBtn.addEventListener('click', () => {
            if (addNewUserModal) {
                addNewUserModal.style.display = 'flex';
                // This modal is a single-step form, so no multi-step setup needed
                addNewUserModal.querySelector('form').reset();
            }
        });
    }

    const addNewServiceBtn = document.getElementById('addNewServiceBtn'); // From schedule.html
    if (addNewServiceBtn) {
        addNewServiceBtn.addEventListener('click', () => {
            if (addServiceModal) {
                addServiceModal.style.display = 'flex';
                setupMultiStepForm('addServiceModal', 'service-info', services, () => renderCalendar()); // Assuming renderCalendar exists
                addServiceModal.querySelector('.form-section').classList.add('active');
                addServiceModal.querySelector('.nav-tab').classList.add('active');
                addServiceModal.querySelector('[id^="prev"][id$="SectionBtn"]').style.display = 'none';
                addServiceModal.querySelector('[id^="next"][id$="SectionBtn"]').style.display = 'inline-flex';
                addServiceModal.querySelector('[id^="submitNew"][id$="FormBtn"]').style.display = 'none';
            }
        });
    }

    // Generic table sorting logic
    const sortTable = (table, column, ascending, getColumnIndex) => {
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        rows.sort((a, b) => {
            const aVal = a.children[getColumnIndex(column)].textContent;
            const bVal = b.children[getColumnIndex(column)].textContent;

            // Date comparison
            if (column.includes('Date') || column.includes('Service') || column.includes('date') || column.includes('next') || column.includes('lastLogin') || column.includes('hireDate') || column.includes('lastOrdered')) {
                return ascending ?
                    new Date(aVal) - new Date(bVal) :
                    new Date(bVal) - new Date(aVal);
            }

            // Numeric comparison (for quantity, cost, assignedServices)
            if (column === 'quantity' || column === 'cost' || column === 'assignedServices' || column === 'totalHoursRun' || column === 'completedServicesMo') {
                const numA = parseFloat(aVal.replace(/[^0-9.-]+/g, ""));
                const numB = parseFloat(bVal.replace(/[^0-9.-]+/g, ""));
                return ascending ? numA - numB : numB - numA;
            }

            // Status/Role comparison (specific order)
            if (column === 'status' || column === 'role') {
                const statusOrder = {
                    'completed': 1, 'pending': 2, 'overdue': 3,
                    'in stock': 1, 'low stock': 2, 'out of stock': 3,
                    'active': 1, 'inactive': 2, 'under maintenance': 3, 'limited': 4, 'suspended': 5,
                    'admin': 3, 'supervisor': 2, 'technician': 1, 'client': 0 // Adjusted for user roles
                };
                return ascending ?
                    (statusOrder[aVal.toLowerCase()] || 0) - (statusOrder[bVal.toLowerCase()] || 0) :
                    (statusOrder[bVal.toLowerCase()] || 0) - (statusOrder[aVal.toLowerCase()] || 0);
            }

            // Default text comparison
            return ascending ?
                aVal.localeCompare(bVal) :
                bVal.localeCompare(aVal);
        });

        // Re-append rows in sorted order
        const tableBody = table.querySelector('tbody');
        tableBody.innerHTML = '';
        rows.forEach(row => tableBody.appendChild(row));
    };

    // Helper function for table sorting
    const setupTableSorting = (tableId, getColumnIndex, dataArray, renderTableCallback) => {
        const table = document.getElementById(tableId);
        if (table) {
            const sortableHeaders = table.querySelectorAll('.sortable');

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

                    // Sort the data array directly
                    dataArray.sort((a, b) => {
                        let aVal = a[sortBy];
                        let bVal = b[sortBy];

                        // Handle null/undefined values for sorting
                        if (aVal === null || aVal === undefined) aVal = '';
                        if (bVal === null || bVal === undefined) bVal = '';

                        // Date comparison
                        if (sortBy.includes('Date') || sortBy.includes('Service') || sortBy.includes('lastLogin') || sortBy.includes('hireDate') || sortBy.includes('lastOrdered')) {
                            const dateA = new Date(aVal);
                            const dateB = new Date(bVal);
                            return isAscending ? dateA - dateB : dateB - dateA;
                        }

                        // Numeric comparison
                        if (typeof aVal === 'number' || typeof bVal === 'number' || sortBy === 'quantity' || sortBy === 'cost' || sortBy === 'assignedServices' || sortBy === 'totalHoursRun' || sortBy === 'completedServicesMo') {
                            const numA = parseFloat(String(aVal).replace(/[^0-9.-]+/g, "") || '0');
                            const numB = parseFloat(String(bVal).replace(/[^0-9.-]+/g, "") || '0');
                            return isAscending ? numA - numB : numB - numA;
                        }

                        // String comparison (case-insensitive for roles/statuses)
                        if (typeof aVal === 'string' && typeof bVal === 'string') {
                            if (sortBy === 'role' || sortBy === 'status') {
                                const order = {
                                    'admin': 3, 'supervisor': 2, 'technician': 1, 'client': 0,
                                    'active': 1, 'inactive': 2, 'under maintenance': 3, 'limited': 4, 'suspended': 5,
                                    'completed': 1, 'pending': 2, 'overdue': 3,
                                    'in stock': 1, 'low stock': 2, 'out of stock': 3
                                };
                                const valA = order[aVal.toLowerCase()] !== undefined ? order[aVal.toLowerCase()] : (aVal.toLowerCase().charCodeAt(0) || 0);
                                const valB = order[bVal.toLowerCase()] !== undefined ? order[bVal.toLowerCase()] : (bVal.toLowerCase().charCodeAt(0) || 0);
                                return isAscending ? valA - valB : valB - valA;
                            }
                            return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                        }
                        return 0; // Should not happen if types are consistent
                    });
                    renderTableCallback(dataArray); // Re-render with sorted data
                });
            });
        }
    };

    // Helper function for table filtering
    const setupTableFiltering = (tableId, filterFunction, resetFunction) => {
        const applyFiltersBtn = document.getElementById(`apply${tableId.replace('Table', 'Filters')}`);
        const resetFiltersBtn = document.getElementById(`reset${tableId.replace('Table', 'Filters')}`);

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => filterFunction());
        }
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => resetFunction());
        }
    };

    // --- Table Rendering Functions (Moved from specific JS files or created) ---

    // User Management Table (admin.html)
    const userManagementTableBody = document.querySelector('#userManagementTable tbody');
    const renderUsersTable = (currentUsers = users) => {
        if (!userManagementTableBody) return;
        userManagementTableBody.innerHTML = '';
        currentUsers.forEach(user => {
            const row = userManagementTableBody.insertRow();
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge role-${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                <td>${user.lastLogin || 'N/A'}</td>
                <td><span class="status-badge ${user.status}-status">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>
                    <button class="action-button edit-user-role" data-id="${user.id}"><i class="fas fa-edit"></i> Edit Role</button>
                    <button class="action-button delete-button" data-id="${user.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
        updateUserStatCards(currentUsers);
        attachUserActionListeners();
    };

    const updateUserStatCards = (currentUsers) => {
        if (document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = currentUsers.length;
        if (document.getElementById('adminUsersCount')) document.getElementById('adminUsersCount').textContent = currentUsers.filter(u => u.role === 'admin').length;
        if (document.getElementById('techUsersCount')) document.getElementById('techUsersCount').textContent = currentUsers.filter(u => u.role === 'technician').length;
        if (document.getElementById('clientUsersCount')) document.getElementById('clientUsersCount').textContent = currentUsers.filter(u => u.role === 'client').length;
    };

    const attachUserActionListeners = () => {
        document.querySelectorAll('.edit-user-role').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.dataset.id;
                const userToEdit = users.find(u => u.id === userId);
                if (userToEdit) {
                    populateModal(editUserRoleModal, userToEdit);
                    editUserRoleModal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this user?')) {
                    const index = users.findIndex(u => u.id === userId);
                    if (index !== -1) {
                        users.splice(index, 1);
                        renderUsersTable();
                        alert('User deleted successfully (simulated)!');
                    }
                }
            });
        });
    };

    // Handle Edit User Role Form Submission (admin.html)
    const editUserRoleForm = document.getElementById('editUserRoleForm');
    if (editUserRoleForm) {
        editUserRoleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = editUserRoleModal.dataset.editingUserId;
            const newRole = document.getElementById('editUserRole').value;
            const newStatus = document.getElementById('userAccessStatus').value;

            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].role = newRole;
                users[userIndex].status = newStatus; // Update status as well
                renderUsersTable();
                editUserRoleModal.style.display = 'none';
                alert(`User ${users[userIndex].name}'s role and status updated to ${newRole}, ${newStatus} (simulated)!`);
            }
        });
    }

    // Handle Add New User Form Submission (admin.html)
    const addNewUserForm = document.getElementById('addNewUserForm');
    if (addNewUserForm) {
        addNewUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = `user-${(users.length + 1).toString().padStart(3, '0')}`;
            const newUser = {
                id: newId,
                name: document.getElementById('newUserName').value,
                email: document.getElementById('newUserEmail').value,
                role: document.getElementById('newUserRole').value,
                status: document.getElementById('newUserStatus').value,
                lastLogin: 'N/A' // New users don't have a last login yet
            };
            users.push(newUser);
            renderUsersTable();
            addNewUserModal.style.display = 'none';
            alert(`New user ${newUser.name} added (simulated)!`);
        });
    }

    const getAdminColumnIndex = (column) => {
        const columns = ['name', 'email', 'role', 'lastLogin', 'status'];
        return columns.indexOf(column);
    };
    const applyUserFilters = () => {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const roleFilter = document.getElementById('userRoleFilter').value;
        const statusFilter = document.getElementById('userStatusFilter').value;

        const filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
        renderUsersTable(filtered);
    };
    const resetUserFilters = () => {
        document.getElementById('userSearch').value = '';
        document.getElementById('userRoleFilter').selectedIndex = 0;
        document.getElementById('userStatusFilter').selectedIndex = 0;
        renderUsersTable();
    };
    setupTableSorting('userManagementTable', getAdminColumnIndex, users, renderUsersTable);
    setupTableFiltering('userManagementTable', applyUserFilters, resetUserFilters);
    renderUsersTable(); // Initial render for admin table


    // Client Generators Table (clientportal.html)
    const clientGeneratorsTableBody = document.querySelector('#clientGeneratorsTable tbody');
    const renderClientGeneratorsTable = (currentGenerators = generators) => {
        if (!clientGeneratorsTableBody) return;
        clientGeneratorsTableBody.innerHTML = '';
        currentGenerators.forEach(gen => {
            const row = clientGeneratorsTableBody.insertRow();
            row.innerHTML = `
                <td>${gen.model}</td>
                <td>${gen.serial}</td>
                <td>${gen.lastService || 'N/A'}</td>
                <td>${gen.nextService || 'N/A'}</td>
                <td><span class="status-badge status-${gen.status.toLowerCase().replace(/\s/g, '-') || 'unknown'}">${gen.status}</span></td>
                <td><button class="action-button view-details" data-id="${gen.id}"><i class="fas fa-eye"></i> View Service History</button></td>
            `;
        });
        // No stat cards for client portal in HTML, so no update function needed here.
    };

    const getClientColumnIndex = (column) => {
        const columns = ['model', 'serial', 'lastService', 'nextService', 'status'];
        return columns.indexOf(column);
    };
    const applyClientFilters = () => {
        const searchTerm = document.getElementById('clientGeneratorSearch').value.toLowerCase();
        const statusFilter = document.getElementById('clientGeneratorStatusFilter').value;
        const dateFrom = document.getElementById('clientDateFrom').value;
        const dateTo = document.getElementById('clientDateTo').value;

        const filtered = generators.filter(gen => {
            const matchesSearch = gen.model.toLowerCase().includes(searchTerm) || gen.serial.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || gen.status.toLowerCase().replace(/\s/g, '-') === statusFilter;
            const matchesDate = (!dateFrom || (gen.lastService && gen.lastService >= dateFrom)) && (!dateTo || (gen.lastService && gen.lastService <= dateTo));
            return matchesSearch && matchesStatus && matchesDate;
        });
        renderClientGeneratorsTable(filtered);
    };
    const resetClientFilters = () => {
        document.getElementById('clientGeneratorSearch').value = '';
        document.getElementById('clientGeneratorStatusFilter').selectedIndex = 0;
        document.getElementById('clientDateFrom').value = '';
        document.getElementById('clientDateTo').value = '';
        renderClientGeneratorsTable();
    };
    setupTableSorting('clientGeneratorsTable', getClientColumnIndex, generators, renderClientGeneratorsTable);
    setupTableFiltering('clientGeneratorsTable', applyClientFilters, resetClientFilters);

    // Loading indicator for clientGeneratorsTable
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator && clientGeneratorsTable) {
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            clientGeneratorsTable.style.display = 'table';
            renderClientGeneratorsTable(); // Initial render after loading
        }, 1500);
    }

    // Parts Table (parts.html)
    const partsTableBody = document.querySelector('#partsTable tbody');
    const renderPartsTable = (currentParts = parts) => {
        if (!partsTableBody) return;
        partsTableBody.innerHTML = '';
        currentParts.forEach(part => {
            const row = partsTableBody.insertRow();
            row.innerHTML = `
                <td>${part.name}</td>
                <td>${part.number}</td>
                <td>${part.quantity}</td>
                <td>$${part.cost.toFixed(2)}</td>
                <td><span class="status-badge ${part.status.toLowerCase().replace(/\s/g, '-')}">${part.status}</span></td>
                <td>
                    <button class="action-button view-details" data-id="${part.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="action-button edit-button" data-id="${part.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-button delete-button" data-id="${part.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
        updatePartsStatCards(currentParts);
        attachPartActionListeners();
    };

    const updatePartsStatCards = (currentParts) => {
        if (document.querySelector('.parts-inventory .stat-card .stat-value')) {
            document.querySelector('.parts-inventory .stat-card:nth-child(1) .stat-value').textContent = currentParts.length;
            document.querySelector('.parts-inventory .stat-card:nth-child(2) .stat-value').textContent = currentParts.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
            const totalValue = currentParts.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
            document.querySelector('.parts-inventory .stat-card:nth-child(3) .stat-value').textContent = `$${totalValue.toFixed(2)}`;
            // Parts Used Last Month is simulated, not derived from currentParts array
        }
    };

    const attachPartActionListeners = () => {
        document.querySelectorAll('#partsTable .edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const partId = e.currentTarget.dataset.id;
                const partToEdit = parts.find(p => p.id === partId);
                if (partToEdit) {
                    // For editing, you'd populate the addPartModal with existing data
                    // This would require a separate function or modifying setupMultiStepForm to handle edit mode
                    alert(`Edit functionality for part ${partToEdit.name} (ID: ${partId}) is simulated.`);
                    // Example: populate form fields and open modal
                    // document.getElementById('newPartName').value = partToEdit.name;
                    // addPartModal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('#partsTable .delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const partId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this part?')) {
                    const index = parts.findIndex(p => p.id === partId);
                    if (index !== -1) {
                        parts.splice(index, 1);
                        renderPartsTable();
                        alert('Part deleted successfully (simulated)!');
                    }
                }
            });
        });
    };

    const getPartsColumnIndex = (column) => {
        const columns = ['name', 'number', 'quantity', 'cost', 'status'];
        return columns.indexOf(column);
    };
    const applyPartsFilters = () => {
        const searchTerm = document.getElementById('partSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('partCategoryFilter').value.toLowerCase();
        const stockStatusFilter = document.getElementById('partStockStatusFilter').value.toLowerCase().replace(/\s/g, '-');

        const filtered = parts.filter(part => {
            const matchesSearch = part.name.toLowerCase().includes(searchTerm) || part.number.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || part.category.toLowerCase() === categoryFilter;
            const matchesStockStatus = !stockStatusFilter || part.status.toLowerCase().replace(/\s/g, '-') === stockStatusFilter;
            return matchesSearch && matchesCategory && matchesStockStatus;
        });
        renderPartsTable(filtered);
    };
    const resetPartsFilters = () => {
        document.getElementById('partSearch').value = '';
        document.getElementById('partCategoryFilter').selectedIndex = 0;
        document.getElementById('partStockStatusFilter').selectedIndex = 0;
        renderPartsTable();
    };
    setupTableSorting('partsTable', getPartsColumnIndex, parts, renderPartsTable);
    setupTableFiltering('partsTable', applyPartsFilters, resetPartsFilters);
    renderPartsTable(); // Initial render for parts table


    // Records Table (records.html and reports.html)
    const recordsTableBody = document.querySelector('#recordsTable tbody');
    const renderRecordsTable = (currentServices = services.filter(s => s.id.startsWith('SRV-'))) => { // Filter for actual service records
        if (!recordsTableBody) return;
        recordsTableBody.innerHTML = '';
        currentServices.forEach(service => {
            const row = recordsTableBody.insertRow();
            row.innerHTML = `
                <td>${service.id}</td>
                <td>${service.generator}</td>
                <td>${service.date}</td>
                <td>${service.next || 'N/A'}</td>
                <td>${service.tech}</td>
                <td><span class="status-badge status-${service.status}">${service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span></td>
                <td><button class="action-button view-details" data-id="${service.id}"><i class="fas fa-eye"></i> View Details</button></td>
            `;
        });
        updateRecordsStatCards(currentServices);
    };

    const updateRecordsStatCards = (currentServices) => {
        if (document.querySelector('.service-records .stat-card .stat-value')) {
            document.querySelector('.service-records .stat-card.completed .stat-value').textContent = currentServices.filter(s => s.status === 'completed').length;
            document.querySelector('.service-records .stat-card.pending .stat-value').textContent = currentServices.filter(s => s.status === 'pending').length;
            document.querySelector('.service-records .stat-card.overdue .stat-value').textContent = currentServices.filter(s => s.status === 'overdue').length;
            // Active Technicians is simulated, not derived from currentServices array
        }
    };

    const getRecordsColumnIndex = (column) => {
        const columns = ['id', 'generator', 'date', 'next', 'tech', 'status'];
        return columns.indexOf(column);
    };
    const applyRecordsFilters = () => {
        const searchTerm = document.getElementById('recordSearch').value.toLowerCase();
        const statusFilter = document.getElementById('recordStatusFilter').value;
        const techFilter = document.getElementById('recordTechnicianFilter').value;
        const dateFrom = document.getElementById('recordDateFrom').value;
        const dateTo = document.getElementById('recordDateTo').value;

        const filtered = services.filter(service => service.id.startsWith('SRV-') && // Ensure only service records
            (service.id.toLowerCase().includes(searchTerm) ||
            service.generator.toLowerCase().includes(searchTerm) ||
            service.tech.toLowerCase().includes(searchTerm)) &&
            (!statusFilter || service.status === statusFilter) &&
            (!techFilter || service.tech === techFilter) &&
            (!dateFrom || (service.date && service.date >= dateFrom)) &&
            (!dateTo || (service.date && service.date <= dateTo))
        );
        renderRecordsTable(filtered);
    };
    const resetRecordsFilters = () => {
        document.getElementById('recordSearch').value = '';
        document.getElementById('recordStatusFilter').selectedIndex = 0;
        document.getElementById('recordTechnicianFilter').selectedIndex = 0;
        document.getElementById('recordDateFrom').value = '';
        document.getElementById('recordDateTo').value = '';
        renderRecordsTable();
    };
    setupTableSorting('recordsTable', getRecordsColumnIndex, services.filter(s => s.id.startsWith('SRV-')), renderRecordsTable);
    setupTableFiltering('recordsTable', applyRecordsFilters, resetRecordsFilters);
    renderRecordsTable(); // Initial render for records table


    // Registry Table (registry.html)
    const registryTableBody = document.querySelector('#registryTable tbody');
    const renderRegistryTable = (currentGenerators = generators) => {
        if (!registryTableBody) return;
        registryTableBody.innerHTML = '';
        currentGenerators.forEach(gen => {
            const row = registryTableBody.insertRow();
            row.innerHTML = `
                <td>${gen.model}</td>
                <td>${gen.type}</td>
                <td>${gen.serial}</td>
                <td>${gen.location}</td>
                <td>${gen.purchaseDate}</td>
                <td>
                    <button class="action-button view-details" data-id="${gen.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="action-button edit-button" data-id="${gen.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-button delete-button" data-id="${gen.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
        attachGeneratorActionListeners();
    };

    const attachGeneratorActionListeners = () => {
        document.querySelectorAll('#registryTable .edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const genId = e.currentTarget.dataset.id;
                const genToEdit = generators.find(g => g.id === genId);
                if (genToEdit) {
                    alert(`Edit functionality for generator ${genToEdit.model} (ID: ${genId}) is simulated.`);
                    // Populate addGeneratorModal for editing
                    // document.getElementById('newGenModel').value = genToEdit.model;
                    // addGeneratorModal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('#registryTable .delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const genId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this generator?')) {
                    const index = generators.findIndex(g => g.id === genId);
                    if (index !== -1) {
                        generators.splice(index, 1);
                        renderRegistryTable();
                        alert('Generator deleted successfully (simulated)!');
                    }
                }
            });
        });
    };

    const getRegistryColumnIndex = (column) => {
        const columns = ['model', 'type', 'serial', 'location', 'purchaseDate'];
        return columns.indexOf(column);
    };
    const applyRegistryFilters = () => {
        const searchTerm = document.getElementById('registrySearch').value.toLowerCase();
        const typeFilter = document.getElementById('registryTypeFilter').value;
        const locationFilter = document.getElementById('registryLocationFilter').value;
        const dateFrom = document.getElementById('registryDateFrom').value;
        const dateTo = document.getElementById('registryDateTo').value;

        const filtered = generators.filter(gen => {
            const matchesSearch = gen.model.toLowerCase().includes(searchTerm) || gen.serial.toLowerCase().includes(searchTerm);
            const matchesType = !typeFilter || gen.type === typeFilter;
            const matchesLocation = !locationFilter || gen.location === locationFilter;
            const matchesDate = (!dateFrom || (gen.purchaseDate && gen.purchaseDate >= dateFrom)) && (!dateTo || (gen.purchaseDate && gen.purchaseDate <= dateTo));
            return matchesSearch && matchesType && matchesLocation && matchesDate;
        });
        renderRegistryTable(filtered);
    };
    const resetRegistryFilters = () => {
        document.getElementById('registrySearch').value = '';
        document.getElementById('registryTypeFilter').selectedIndex = 0;
        document.getElementById('registryLocationFilter').selectedIndex = 0;
        document.getElementById('registryDateFrom').value = '';
        document.getElementById('registryDateTo').value = '';
        renderRegistryTable();
    };
    setupTableSorting('registryTable', getRegistryColumnIndex, generators, renderRegistryTable);
    setupTableFiltering('registryTable', applyRegistryFilters, resetRegistryFilters);
    renderRegistryTable(); // Initial render for registry table


    // Team Table (team.html)
    const teamTableBody = document.querySelector('#teamTable tbody');
    const renderTeamTable = (currentTechnicians = technicians) => {
        if (!teamTableBody) return;
        teamTableBody.innerHTML = '';
        currentTechnicians.forEach(tech => {
            const row = teamTableBody.insertRow();
            row.innerHTML = `
                <td>${tech.name}</td>
                <td>${tech.email}</td>
                <td>${tech.phone || 'N/A'}</td>
                <td>${tech.role}</td>
                <td>${tech.assignedServices || 0}</td>
                <td><span class="status-badge ${tech.status.toLowerCase()}-status">${tech.status}</span></td>
                <td>
                    <button class="action-button view-details" data-id="${tech.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="action-button edit-button" data-id="${tech.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-button delete-button" data-id="${tech.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
        updateTeamStatCards(currentTechnicians);
        attachTeamActionListeners();
    };

    const updateTeamStatCards = (currentTechnicians) => {
        if (document.querySelector('.team-management .stat-card .stat-value')) {
            document.querySelector('.team-management .stat-card.completed .stat-value').textContent = currentTechnicians.filter(t => t.status === 'Active').length;
            // Certifications Due and Overdue Assignments are simulated, not derived from currentTechnicians array
            // Avg Services/Tech (Mo) is simulated
        }
    };

    const attachTeamActionListeners = () => {
        document.querySelectorAll('#teamTable .edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const techId = e.currentTarget.dataset.id;
                const techToEdit = technicians.find(t => t.id === techId);
                if (techToEdit) {
                    alert(`Edit functionality for technician ${techToEdit.name} (ID: ${techId}) is simulated.`);
                    // Populate addTechnicianModal for editing
                    // document.getElementById('techName').value = techToEdit.name;
                    // addTechnicianModal.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('#teamTable .delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const techId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this technician?')) {
                    const index = technicians.findIndex(t => t.id === techId);
                    if (index !== -1) {
                        technicians.splice(index, 1);
                        renderTeamTable();
                        alert('Technician deleted successfully (simulated)!');
                    }
                }
            });
        });
    };

    const getTeamColumnIndex = (column) => {
        const columns = ['name', 'email', 'phone', 'role', 'assignedServices', 'status'];
        return columns.indexOf(column);
    };
    const applyTeamFilters = () => {
        const searchTerm = document.getElementById('teamSearch').value.toLowerCase();
        const roleFilter = document.getElementById('teamRoleFilter').value;
        const statusFilter = document.getElementById('teamStatusFilter').value;

        const filtered = technicians.filter(tech => {
            const matchesSearch = tech.name.toLowerCase().includes(searchTerm) || tech.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || tech.role === roleFilter;
            const matchesStatus = !statusFilter || tech.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
        renderTeamTable(filtered);
    };
    const resetTeamFilters = () => {
        document.getElementById('teamSearch').value = '';
        document.getElementById('teamRoleFilter').selectedIndex = 0;
        document.getElementById('teamStatusFilter').selectedIndex = 0;
        renderTeamTable();
    };
    setupTableSorting('teamTable', getTeamColumnIndex, technicians, renderTeamTable);
    setupTableFiltering('teamTable', applyTeamFilters, resetTeamFilters);
    renderTeamTable(); // Initial render for team table


    // Schedule Calendar (schedule.html)
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();

    const renderCalendar = () => {
        if (!calendarGrid) return; // Ensure element exists
        calendarGrid.innerHTML = ''; // Clear previous calendar
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYear.textContent = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day', 'header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Fill leading empty days
        const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'other-month');
            calendarGrid.appendChild(emptyDay);
        }

        // Fill days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'current-month');
            dayElement.innerHTML = `<span class="day-number">${day}</span>`;

            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const servicesForDay = services.filter(service => service.id.startsWith('SCH-') && service.date === fullDate); // Filter for schedule services

            if (servicesForDay.length > 0) {
                dayElement.classList.add('has-service');
                servicesForDay.forEach(service => {
                    const serviceEvent = document.createElement('div');
                    serviceEvent.classList.add('service-event', `status-${service.status}`);
                    serviceEvent.textContent = `${service.generator} - ${service.type}`;
                    serviceEvent.dataset.id = service.id; // Use actual service ID
                    dayElement.appendChild(serviceEvent);

                    // Add event listener to open modal
                    serviceEvent.addEventListener('click', () => {
                        populateModal(serviceDetailsModal, service); // Pass full service data to modal
                        serviceDetailsModal.style.display = 'flex';
                    });
                });
            }
            calendarGrid.appendChild(dayElement);
        }

        // Fill trailing empty days (to complete the last week row)
        const totalDaysDisplayed = startDay + daysInMonth;
        const remainingDays = (7 - (totalDaysDisplayed % 7)) % 7;
        for (let i = 0; i < remainingDays; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'other-month');
            calendarGrid.appendChild(emptyDay);
        }
    };

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    renderCalendar(); // Initial render for calendar


    // Client Portal Welcome Message (clientportal.html)
    const clientInfoHeading = document.querySelector('.client-info .stat-label');
    if (clientInfoHeading) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const clientName = loggedInUser && loggedInUser.role === 'client' ? loggedInUser.name : 'Valued Client';
        clientInfoHeading.innerHTML = `<i class="fas fa-handshake"></i> Welcome, ${clientName}!`;
    }
});
