Based on the provided documentation and the existing `index.html` (which serves as the Dashboard page), I will outline the structure for creating the remaining pages for the GenMaint Pro Generator Maintenance System. Each page will have its own `.html` and `.js` file, while sharing the `style.css` file for consistent styling.

### **Page Structure Overview**

*   **Dashboard:** `index.html`, `script.js` (already provided)
*   **Registry:** `registry.html`, `registry.js`
*   **Schedule:** `schedule.html`, `schedule.js`
*   **Records:** `records.html`, `records.js`
*   **Parts:** `parts.html`, `parts.js`
*   **Team:** `team.html`, `team.js`
*   **Reports:** (Covered by `index.html` - Dashboard)
*   **Sign In:** `signin.html`, `signin.js`
*   **Client Portal:** `clientportal.html`, `clientportal.js`

All `.html` files will link to the shared `style.css` and their respective `.js` files. The navigation links in the header will be updated to point to these new HTML files.

---

### **Detailed Page Designs**

#### **1. Dashboard Page**

*   **File Names:** `index.html`, `script.js`, `style.css`
*   **Description:** This page is already provided and serves as the main "Reports & Analytics" dashboard. It displays key performance indicators (KPIs) like total services, total cost, average response time, and overdue services, along with a service volume trend chart.
*   **Key Elements:**
    *   Header with navigation, dark mode toggle, reports button (active), sign-in, and client portal buttons.
    *   Section for "Reports & Analytics" with a date range dropdown and export button.
    *   Metric cards displaying KPIs.
    *   Chart for "Service Volume Trend".
*   **JavaScript (`script.js`):** Handles chart initialization, dark mode toggle, mobile menu toggle, and dropdown functionality.

---

#### **2. Registry Page**

*   **File Names:** `registry.html`, `registry.js`, `style.css`
*   **Description:** This page will manage the generator registry, allowing users to view, add, edit, and delete generator records. It aligns with the "Asset Management" core feature.
*   **HTML (`registry.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Generator Registry</title>
        <style>
            /* Add any specific styles for the registry page here if needed */
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html" aria-current="page">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="registry-management" aria-labelledby="registry-heading">
                <div class="section-header">
                    <div>
                        <h2 id="registry-heading">Generator Registry</h2>
                        <p>Manage all registered generators and their details.</p>
                    </div>
                    <button class="reports-button">Add New Generator</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Serial Number</th>
                                <th>Location</th>
                                <th>Purchase Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example Row - Data will be loaded dynamically via JavaScript -->
                            <tr>
                                <td>GenPro X100</td>
                                <td>Diesel</td>
                                <td>SN-GPX100-001</td>
                                <td>Warehouse A</td>
                                <td>2022-01-15</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>PowerGen 5000</td>
                                <td>Gasoline</td>
                                <td>SN-PG5000-002</td>
                                <td>Site B</td>
                                <td>2023-03-20</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <!-- More rows -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <script src="registry.js"></script>
        <script src="script.js"></script> <!-- For shared functionalities like dark mode, mobile menu -->
    </body>
    </html>
    ```

*   **JavaScript (`registry.js`):**
    *   Will handle fetching generator data from a backend API (e.g., `/api/generators`).
    *   Populate the table dynamically.
    *   Implement functionality for "Add New Generator" (e.g., opening a modal form).
    *   Handle "Edit" and "Delete" actions (e.g., sending requests to the API).
    *   **Note:** The `script.js` (from the dashboard) will be included for shared functionalities like dark mode and mobile menu.

---

#### **3. Schedule Page**

*   **File Names:** `schedule.html`, `schedule.js`, `style.css`
*   **Description:** This page will provide a calendar view of upcoming services and allow for service interval configuration. It aligns with the "Maintenance Scheduling" core feature.
*   **HTML (`schedule.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Maintenance Schedule</title>
        <style>
            /* Specific styles for calendar view */
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                background-color: var(--card-bg);
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .calendar-day {
                border: 1px solid var(--border);
                padding: 10px;
                min-height: 100px;
                background-color: var(--bg);
                border-radius: 5px;
                font-size: 0.9rem;
                position: relative;
            }
            .calendar-day.header {
                background-color: var(--primary);
                color: white;
                text-align: center;
                font-weight: bold;
                padding: 8px;
            }
            .calendar-day.has-service {
                background-color: rgba(63, 81, 181, 0.1);
                border-color: var(--primary);
            }
            .service-event {
                background-color: var(--primary);
                color: white;
                padding: 3px 5px;
                border-radius: 3px;
                margin-top: 5px;
                font-size: 0.8rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html" aria-current="page">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="schedule-management" aria-labelledby="schedule-heading">
                <div class="section-header">
                    <div>
                        <h2 id="schedule-heading">Maintenance Schedule</h2>
                        <p>View and manage upcoming generator services.</p>
                    </div>
                    <div class="export">
                        <button class="reports-button">Configure Intervals</button>
                        <button class="export-button">Add New Service</button>
                    </div>
                </div>

                <div class="calendar-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <button class="reports-button" id="prevMonth">← Previous</button>
                    <h3 id="currentMonthYear"></h3>
                    <button class="reports-button" id="nextMonth">Next →</button>
                </div>

                <div class="calendar-grid" id="calendarGrid">
                    <!-- Calendar days will be generated here by JavaScript -->
                </div>
            </section>
        </main>

        <script src="schedule.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`schedule.js`):**
    *   Will generate a dynamic calendar view.
    *   Fetch upcoming service dates from the backend (e.g., `/api/services/upcoming`).
    *   Highlight days with scheduled services.
    *   Implement navigation for months.
    *   Handle "Configure Intervals" and "Add New Service" actions.

---

#### **4. Records Page**

*   **File Names:** `records.html`, `records.js`, `style.css`
*   **Description:** This page will display the service history for all generators, allowing users to search, filter, and view details of past maintenance activities. It aligns with "Service history tracking" and "Work Order Management".
*   **HTML (`records.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Service Records</title>
        <style>
            /* Specific styles for records page */
            .filter-bar {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            .filter-bar input, .filter-bar select {
                padding: 8px 12px;
                border: 1px solid var(--border);
                border-radius: 5px;
                background-color: var(--card-bg);
                color: var(--text);
            }
            .filter-bar button {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html" aria-current="page">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="service-records" aria-labelledby="records-heading">
                <div class="section-header">
                    <div>
                        <h2 id="records-heading">Service Records</h2>
                        <p>Browse and search through all past maintenance activities.</p>
                    </div>
                    <button class="reports-button">Export Records</button>
                </div>

                <div class="filter-bar">
                    <input type="text" placeholder="Search by Generator, Technician..." id="recordSearch">
                    <select id="recordStatusFilter">
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <input type="date" id="recordDateFilter">
                    <button>Apply Filters</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Service ID</th>
                                <th>Generator</th>
                                <th>Service Date</th>
                                <th>Next Service</th>
                                <th>Technician</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example Row - Data will be loaded dynamically via JavaScript -->
                            <tr>
                                <td>SRV-001</td>
                                <td>GenPro X100</td>
                                <td>2024-03-10</td>
                                <td>2024-09-10</td>
                                <td>John Doe</td>
                                <td>Completed</td>
                                <td><button class="action-button view-details">View Details</button></td>
                            </tr>
                            <tr>
                                <td>SRV-002</td>
                                <td>PowerGen 5000</td>
                                <td>2024-04-05</td>
                                <td>2024-10-05</td>
                                <td>Jane Smith</td>
                                <td>Pending</td>
                                <td><button class="action-button view-details">View Details</button></td>
                            </tr>
                            <!-- More rows -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <script src="records.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`records.js`):**
    *   Fetch service records from the backend (e.g., `/api/services`).
    *   Implement search and filter functionalities.
    *   Populate the table dynamically.
    *   Handle "View Details" actions (e.g., opening a modal with full service notes and parts used).

---

#### **5. Parts Page**

*   **File Names:** `parts.html`, `parts.js`, `style.css`
*   **Description:** This page will manage the inventory of parts, allowing users to track quantity in stock, add new parts, and update existing ones. It aligns with "Parts inventory management" and "Parts usage logging".
*   **HTML (`parts.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Parts Inventory</title>
        <style>
            /* Specific styles for parts page */
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html" aria-current="page">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="parts-inventory" aria-labelledby="parts-heading">
                <div class="section-header">
                    <div>
                        <h2 id="parts-heading">Parts Inventory</h2>
                        <p>Manage spare parts stock and usage.</p>
                    </div>
                    <button class="reports-button">Add New Part</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Part Name</th>
                                <th>Part Number</th>
                                <th>Quantity in Stock</th>
                                <th>Cost per Unit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example Row - Data will be loaded dynamically via JavaScript -->
                            <tr>
                                <td>Oil Filter</td>
                                <td>OF-12345</td>
                                <td>50</td>
                                <td>$15.00</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Spark Plug</td>
                                <td>SP-67890</td>
                                <td>120</td>
                                <td>$5.50</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <!-- More rows -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <script src="parts.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`parts.js`):**
    *   Fetch parts data from the backend (e.g., `/api/parts`).
    *   Populate the table dynamically.
    *   Implement "Add New Part", "Edit", and "Delete" functionalities.

---

#### **6. Team Page**

*   **File Names:** `team.html`, `team.js`, `style.css`
*   **Description:** This page will manage technician profiles, allowing for assignment and contact information. It aligns with "Technician assignment" and "Notification System".
*   **HTML (`team.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Team Management</title>
        <style>
            /* Specific styles for team page */
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html" aria-current="page">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="team-management" aria-labelledby="team-heading">
                <div class="section-header">
                    <div>
                        <h2 id="team-heading">Team Management</h2>
                        <p>Manage technicians and their assignments.</p>
                    </div>
                    <button class="reports-button">Add New Technician</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Assigned Services</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example Row - Data will be loaded dynamically via JavaScript -->
                            <tr>
                                <td>John Doe</td>
                                <td>john.doe@example.com</td>
                                <td>+1234567890</td>
                                <td>15</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Jane Smith</td>
                                <td>jane.smith@example.com</td>
                                <td>+0987654321</td>
                                <td>12</td>
                                <td>
                                    <button class="action-button edit-button">Edit</button>
                                    <button class="action-button delete-button">Delete</button>
                                </td>
                            </tr>
                            <!-- More rows -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <script src="team.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`team.js`):**
    *   Fetch technician data from the backend (e.g., `/api/technicians`).
    *   Populate the table dynamically.
    *   Implement "Add New Technician", "Edit", and "Delete" functionalities.

---

#### **7. Sign In Page**

*   **File Names:** `signin.html`, `signin.js`, `style.css`
*   **Description:** A simple sign-in page for technicians and administrators.
*   **HTML (`signin.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Sign In</title>
        <style>
            .signin-container {
                max-width: 400px;
                margin: 50px auto;
                padding: 30px;
                background-color: var(--card-bg);
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                text-align: center;
            }
            .signin-container h2 {
                color: var(--primary);
                margin-bottom: 25px;
            }
            .signin-form label {
                display: block;
                text-align: left;
                margin-bottom: 8px;
                color: var(--text);
            }
            .signin-form input[type="email"],
            .signin-form input[type="password"] {
                width: calc(100% - 24px); /* Account for padding */
                padding: 12px;
                margin-bottom: 20px;
                border: 1px solid var(--border);
                border-radius: 5px;
                background-color: var(--bg);
                color: var(--text);
            }
            .signin-form button {
                width: 100%;
                padding: 12px;
                background-color: var(--primary);
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .signin-form button:hover {
                background-color: var(--primary-dark);
            }
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button active">Sign In</button>
                        <button class="client-button">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="signin-section">
                <div class="signin-container">
                    <h2>Sign In to GenMaint Pro</h2>
                    <form class="signin-form" id="signinForm">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                        
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                        
                        <button type="submit">Sign In</button>
                    </form>
                </div>
            </section>
        </main>

        <script src="signin.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`signin.js`):**
    *   Handle form submission.
    *   Send authentication requests to the backend (e.g., `/api/auth/login`).
    *   Redirect users upon successful login.

---

#### **8. Client Portal Page**

*   **File Names:** `clientportal.html`, `clientportal.js`, `style.css`
*   **Description:** A simplified view for clients to see their assigned generators and their service history. As per the rapid development plan, this will be a "simple view (no auth)" initially, meaning it might display public information or require a simple lookup. If authentication is added later, it would be similar to the sign-in page.
*   **HTML (`clientportal.html`):**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>GenMaint Pro - Client Portal</title>
        <style>
            /* Specific styles for client portal */
            .client-info {
                background-color: var(--card-bg);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .client-info h3 {
                color: var(--primary);
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <header>
            <nav>
                <div class="logo">
                    <div class="logo-placeholder" aria-label="GenMaint Pro Logo">GP</div>
                </div>
                <div class="title">
                    <h1>GenMaint Pro</h1>
                    <p>Generator Maintenance System</p>
                </div>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">☰</button>
                <div class="header-container">
                    <div class="nav-actions">
                        <div class="nav-container" id="navContainer">
                            <ul class="nav-links">
                                <li><a href="index.html">Dashboard</a></li>
                                <li><a href="registry.html">Registry</a></li>
                                <li><a href="schedule.html">Schedule</a></li>
                                <li><a href="records.html">Records</a></li>
                                <li><a href="parts.html">Parts</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                        <button class="toggle-button" id="darkModeToggle" aria-label="Toggle dark mode">
                            <span id="darkModeIcon">🌙</span> Dark Mode
                        </button>
                        <button class="reports-button">Reports</button>
                        <button class="signing-button">Sign In</button>
                        <button class="client-button active">Client Portal</button>
                    </div>
                </div>
            </nav>
        </header>

        <main>
            <section class="client-portal-section" aria-labelledby="client-portal-heading">
                <div class="section-header">
                    <div>
                        <h2 id="client-portal-heading">Client Portal</h2>
                        <p>View your assigned generators and their service history.</p>
                    </div>
                </div>

                <div class="client-info">
                    <h3>Welcome, [Client Name]!</h3>
                    <p>Here's an overview of your generators and their recent services.</p>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Generator Model</th>
                                <th>Serial Number</th>
                                <th>Last Service Date</th>
                                <th>Next Service Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Example Row - Data will be loaded dynamically via JavaScript -->
                            <tr>
                                <td>GenPro X100</td>
                                <td>SN-GPX100-001</td>
                                <td>2024-03-10</td>
                                <td>2024-09-10</td>
                                <td>Completed</td>
                                <td><button class="action-button view-details">View Service History</button></td>
                            </tr>
                            <!-- More rows -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <script src="clientportal.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    ```

*   **JavaScript (`clientportal.js`):**
    *   Fetch client-specific generator and service data (e.g., `/api/client/generators`).
    *   Populate the table dynamically.
    *   Handle "View Service History" actions.

---

### **Shared JavaScript (`script.js`) Updates**

The existing `script.js` file contains general functionalities like dark mode toggle, mobile menu toggle, and dropdowns. This file should be included in all new HTML pages to maintain consistency.

*   **Update Navigation Links:** Ensure all `href` attributes in the `nav-links` list point to the correct `.html` files. For example:
    *   `<a href="index.html">Dashboard</a>`
    *   `<a href="registry.html">Registry</a>`
    *   `<a href="schedule.html">Schedule</a>`
    *   And so on for all pages.
*   **Active Navigation State:** The `aria-current="page"` attribute should be dynamically set by the JavaScript of each page to highlight the currently active navigation link. This can be done by checking `window.location.pathname`.

---

### **General Considerations for All Pages**

*   **Backend Integration:** Each `.js` file will need to make API calls to the backend (Node.js/Express with PostgreSQL/Supabase) to fetch and send data. The API endpoints would follow a RESTful pattern (e.g., `/api/generators`, `/api/services`, `/api/parts`, `/api/technicians`, `/api/auth`).
*   **Modals/Forms:** For "Add New" or "Edit" functionalities, consider using modal dialogs to keep the user on the same page and provide a smoother experience.
*   **Error Handling & Loading States:** Implement proper error handling for API calls and display loading indicators to the user.
*   **Responsiveness:** Ensure the new pages also adhere to the responsive design principles outlined in `style.css` and the media queries.
*   **Accessibility:** Continue to use ARIA attributes and semantic HTML for improved accessibility.

This detailed breakdown provides a solid foundation for building out the complete GenMaint Pro system with distinct pages, each serving its specific purpose while maintaining a consistent look and feel.