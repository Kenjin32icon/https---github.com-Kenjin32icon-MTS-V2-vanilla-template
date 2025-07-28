document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const addNewServiceBtn = document.getElementById('addNewServiceBtn');
    const addServiceModal = document.getElementById('addServiceModal');
    const addServiceForm = document.getElementById('addServiceForm');

    let currentDate = new Date();

    // Sample service data - in a real application, this would come from an API
    const services = [
        {
            id: 'SCH-001',
            date: '2024-05-10',
            time: '10:00 AM',
            type: 'Oil Change',
            status: 'completed',
            generator: 'GenPro X100',
            serial: 'SN-GPX100-001',
            location: 'Warehouse A',
            lastService: '2024-03-10',
            technician: 'John Doe',
            team: 'Maintenance Crew A',
            contact: 'john.doe@example.com',
            priority: 'Medium',
            duration: '1.5 hours',
            parts: 'Oil Filter, 5L Synthetic Oil',
            notes: 'Routine oil and filter change. Generator running well.'
        },
        {
            id: 'SCH-002',
            date: '2024-05-15',
            time: '01:30 PM',
            type: 'Filter Replacement',
            status: 'pending',
            generator: 'PowerGen 5000',
            serial: 'SN-PG5000-002',
            location: 'Site B',
            lastService: '2024-02-20',
            technician: 'Jane Smith',
            team: 'Field Team Alpha',
            contact: 'jane.smith@example.com',
            priority: 'High',
            duration: '2 hours',
            parts: 'Air Filter, Fuel Filter',
            notes: 'Scheduled replacement of air and fuel filters. Check for debris.'
        },
        {
            id: 'SCH-003',
            date: '2024-05-20',
            time: '09:00 AM',
            type: 'Full Inspection',
            status: 'overdue',
            generator: 'EcoPower 3000',
            serial: 'SN-EP3000-003',
            location: 'Main Office',
            lastService: '2023-11-01',
            technician: 'Robert Johnson',
            team: 'Inspection Unit',
            contact: 'robert.j@example.com',
            priority: 'Critical',
            duration: '3 hours',
            parts: 'N/A',
            notes: 'Comprehensive annual inspection. Overdue by 2 weeks. Prioritize.'
        },
        {
            id: 'SCH-004',
            date: '2024-06-05',
            time: '11:00 AM',
            type: 'Battery Check',
            status: 'pending',
            generator: 'GenPro X200',
            serial: 'SN-GPX200-004',
            location: 'Warehouse C',
            lastService: '2024-04-01',
            technician: 'Emily Davis',
            team: 'Maintenance Crew B',
            contact: 'emily.d@example.com',
            priority: 'Medium',
            duration: '1 hour',
            parts: 'N/A',
            notes: 'Check battery fluid levels and terminal connections.'
        },
        {
            id: 'SCH-005',
            date: '2024-06-12',
            time: '02:00 PM',
            type: 'Coolant Flush',
            status: 'pending',
            generator: 'PowerGen 7000',
            serial: 'SN-PG7000-005',
            location: 'Remote Site D',
            lastService: '2024-01-15',
            technician: 'Michael Brown',
            team: 'Field Team Beta',
            contact: 'michael.b@example.com',
            priority: 'High',
            duration: '2.5 hours',
            parts: 'Coolant, Distilled Water',
            notes: 'Full coolant system flush and refill.'
        }
    ];

    function renderCalendar() {
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
            const servicesForDay = services.filter(service => service.date === fullDate);

            if (servicesForDay.length > 0) {
                dayElement.classList.add('has-service');
                servicesForDay.forEach(service => {
                    const serviceEvent = document.createElement('div');
                    serviceEvent.classList.add('service-event', `status-${service.status}`);
                    serviceEvent.textContent = `${service.generator} - ${service.type}`;
                    serviceEvent.dataset.serviceId = service.id; // Use actual service ID
                    dayElement.appendChild(serviceEvent);

                    // Add event listener to open modal
                    serviceEvent.addEventListener('click', () => {
                        openServiceModal(service); // Pass full service data to modal
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
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar(); // Initial render

    // Service Details Modal functionality
    const serviceDetailsModal = document.getElementById('serviceDetailsModal');

    function openServiceModal(serviceData) {
        // Populate modal with serviceData
        document.getElementById('modal-service-id').textContent = serviceData.id;
        document.getElementById('modal-service-date').textContent = serviceData.date;
        document.getElementById('modal-service-time').textContent = serviceData.time;
        document.getElementById('modal-service-type').textContent = serviceData.type;

        document.getElementById('modal-gen-model').textContent = serviceData.generator;
        document.getElementById('modal-gen-serial').textContent = serviceData.serial;
        document.getElementById('modal-gen-location').textContent = serviceData.location;
        document.getElementById('modal-gen-last-service').textContent = serviceData.lastService;

        document.getElementById('modal-tech-name').textContent = serviceData.technician;
        document.getElementById('modal-tech-team').textContent = serviceData.team;
        document.getElementById('modal-tech-contact').textContent = serviceData.contact;
        document.getElementById('modal-service-priority').textContent = serviceData.priority;

        const modalStatusBadge = document.getElementById('modal-service-status');
        modalStatusBadge.className = `status-badge status-${serviceData.status}`;
        modalStatusBadge.textContent = serviceData.status.charAt(0).toUpperCase() + serviceData.status.slice(1);

        document.getElementById('modal-service-duration').textContent = serviceData.duration;
        document.getElementById('modal-service-parts').textContent = serviceData.parts;
        document.getElementById('modal-service-notes').textContent = serviceData.notes;

        serviceDetailsModal.style.display = 'flex';
    }

    // Add New Service Modal functionality
    if (addNewServiceBtn) {
        addNewServiceBtn.addEventListener('click', () => {
            addServiceModal.style.display = 'flex';
            showFormSection('service-info'); // Ensure first section is shown on open
        });
    }

    // Close Add New Service Modal
    const closeAddServiceModalBtns = addServiceModal.querySelectorAll('.close-modal, .btn-close');
    closeAddServiceModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addServiceModal.style.display = 'none';
            addServiceForm.reset(); // Clear form fields
            showFormSection('service-info'); // Reset to first section
        });
    });

    // New Service Form Section Navigation Logic
    const formSections = addServiceModal.querySelectorAll('.form-section');
    const navTabs = addServiceModal.querySelectorAll('.nav-tab');
    const prevSectionBtn = document.getElementById('prevServiceSectionBtn');
    const nextSectionBtn = document.getElementById('nextServiceSectionBtn');
    const submitNewFormBtn = document.getElementById('submitNewServiceFormBtn');

    let currentSectionIndex = 0;

    const showFormSection = (sectionId) => {
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
        prevSectionBtn.style.display = currentSectionIndex === 0 ? 'none' : 'inline-flex';
        nextSectionBtn.style.display = currentSectionIndex === formSections.length - 1 ? 'none' : 'inline-flex';
        submitNewFormBtn.style.display = currentSectionIndex === formSections.length - 1 ? 'inline-flex' : 'none';
    };

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.dataset.section;
            showFormSection(sectionId);
        });
    });

    if (prevSectionBtn) {
        prevSectionBtn.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                showFormSection(formSections[currentSectionIndex].id.replace('section-', ''));
            }
        });
    }

    if (nextSectionBtn) {
        nextSectionBtn.addEventListener('click', () => {
            // Optional: Add validation here before moving to next section
            if (currentSectionIndex < formSections.length - 1) {
                currentSectionIndex++;
                showFormSection(formSections[currentSectionIndex].id.replace('section-', ''));
            }
        });
    }

    // Initial state for buttons when modal opens (called when modal is opened)
    // updateNavButtons(); // This will be called by showFormSection on modal open

    // Submit New Service Form
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            // Gather form data
            const newService = {
                id: document.getElementById('serviceId').value,
                date: document.getElementById('serviceDate').value,
                time: document.getElementById('serviceTime').value,
                type: document.getElementById('serviceType').value,
                status: document.getElementById('serviceStatus').value,
                generator: document.getElementById('genModel').value,
                serial: document.getElementById('genSerial').value,
                location: document.getElementById('genLocation').value,
                lastService: document.getElementById('genLastService').value,
                technician: document.getElementById('techName').value,
                team: document.getElementById('techTeam').value,
                contact: document.getElementById('techContact').value,
                priority: document.getElementById('servicePriority').value,
                duration: document.getElementById('serviceDuration').value,
                parts: document.getElementById('serviceParts').value,
                notes: document.getElementById('serviceNotes').value
            };

            // Add the new service to the services array
            services.push(newService);

            // Re-render the calendar to show the new service
            renderCalendar();

            // Close the modal and reset the form
            addServiceModal.style.display = 'none';
            addServiceForm.reset();
            showFormSection('service-info'); // Reset to first section

            alert('New service added successfully!');
        });
    }
});
