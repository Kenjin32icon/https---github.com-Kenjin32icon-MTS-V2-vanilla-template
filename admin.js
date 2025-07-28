// admin.js (Specific JavaScript for admin.html)

document.addEventListener('DOMContentLoaded', () => {
    const userManagementTableBody = document.querySelector('#userManagementTable tbody');
    const editUserRoleModal = document.getElementById('editUserRoleModal');
    const addNewUserModal = document.getElementById('addNewUserModal');
    const addNewUserBtn = document.getElementById('addNewUserBtn');
    const editUserRoleForm = document.getElementById('editUserRoleForm');
    const editUserRoleSelect = document.getElementById('editUserRole');
    const permissionsDisplay = document.getElementById('permissionsDisplay');

    // Simulated User Data (in a real app, this would come from a database)
    let users = [
        { id: 'user-001', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'admin', status: 'active' },
        { id: 'user-002', name: 'Bob Williams', email: 'bob.w@example.com', role: 'technician', status: 'active' },
        { id: 'user-003', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'client', status: 'active' },
        { id: 'user-004', name: 'Diana Prince', email: 'diana.p@example.com', role: 'technician', status: 'inactive' },
        { id: 'user-005', name: 'Eve Adams', email: 'eve.a@example.com', role: 'client', status: 'active' },
    ];

    // Define permissions for each role
    const rolePermissions = {
        'admin': {
            dashboard: 'view', registry: 'manage', schedule: 'manage', records: 'manage',
            parts: 'manage', team: 'manage', reports: 'view', clientportal: 'view', admin: 'manage'
        },
        'technician': {
            dashboard: 'view', registry: 'view', schedule: 'manage', records: 'manage',
            parts: 'view', team: 'view', reports: 'view', clientportal: 'hidden', admin: 'hidden'
        },
        'client': {
            dashboard: 'hidden', registry: 'hidden', schedule: 'hidden', records: 'hidden',
            parts: 'hidden', team: 'hidden', reports: 'hidden', clientportal: 'view', admin: 'hidden'
        }
    };

    // Function to render users in the table
    const renderUsers = (filteredUsers = users) => {
        userManagementTableBody.innerHTML = '';
        filteredUsers.forEach(user => {
            const row = userManagementTableBody.insertRow();
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge role-${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                <td><span class="status-badge ${user.status}-status">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>
                    <button class="action-button edit-user-role" data-id="${user.id}"><i class="fas fa-edit"></i> Edit Role</button>
                    <button class="action-button delete-button" data-id="${user.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </td>
            `;
        });
        updateStatCards(filteredUsers);
        attachUserActionListeners();
    };

    // Function to update stat cards
    const updateStatCards = (currentUsers) => {
        document.getElementById('totalUsersCount').textContent = currentUsers.length;
        document.getElementById('adminUsersCount').textContent = currentUsers.filter(u => u.role === 'admin').length;
        document.getElementById('techUsersCount').textContent = currentUsers.filter(u => u.role === 'technician').length;
        document.getElementById('clientUsersCount').textContent = currentUsers.filter(u => u.role === 'client').length;
    };

    // Attach event listeners for edit/delete buttons
    const attachUserActionListeners = () => {
        document.querySelectorAll('.edit-user-role').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.dataset.id;
                const userToEdit = users.find(u => u.id === userId);
                if (userToEdit) {
                    openEditUserRoleModal(userToEdit);
                }
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this user?')) {
                    users = users.filter(u => u.id !== userId);
                    renderUsers(); // Re-render table after deletion
                    alert('User deleted successfully (simulated)!');
                }
            });
        });
    };

    // Open Edit User Role Modal
    const openEditUserRoleModal = (user) => {
        document.getElementById('modalUserName').textContent = user.name;
        document.getElementById('modalUserEmail').textContent = user.email;
        document.getElementById('editUserRole').value = user.role;
        editUserRoleModal.dataset.editingUserId = user.id; // Store ID for saving changes
        updatePermissionsDisplay(user.role); // Display permissions for current role
        editUserRoleModal.style.display = 'flex';
    };

    // Update permissions display based on selected role
    const updatePermissionsDisplay = (role) => {
        const permissions = rolePermissions[role] || {};
        permissionsDisplay.querySelectorAll('.permission-status').forEach(span => {
            const permissionKey = span.dataset.permission;
            const status = permissions[permissionKey] || 'no-access'; // Default to no-access
            span.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            span.className = `permission-status permission-${status.replace(/\s/g, '-')}`; // Add class for styling
        });
    };

    // Event listener for role select change in modal
    editUserRoleSelect.addEventListener('change', (e) => {
        updatePermissionsDisplay(e.target.value);
    });

    // Handle Edit User Role Form Submission
    editUserRoleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = editUserRoleModal.dataset.editingUserId;
        const newRole = document.getElementById('editUserRole').value;

        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].role = newRole;
            renderUsers(); // Re-render table to reflect changes
            editUserRoleModal.style.display = 'none';
            alert(`User ${users[userIndex].name}'s role updated to ${newRole} (simulated)!`);
        }
    });

    // Handle Add New User Button
    if (addNewUserBtn) {
        addNewUserBtn.addEventListener('click', () => {
            addNewUserModal.style.display = 'flex';
            document.getElementById('addNewUserForm').reset(); // Clear form
        });
    }

    // Handle Add New User Form Submission
    const addNewUserForm = document.getElementById('addNewUserForm');
    if (addNewUserForm) {
        addNewUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = `user-${(users.length + 1).toString().padStart(3, '0')}`; // Simple ID generation
            const newUser = {
                id: newId,
                name: document.getElementById('newUserName').value,
                email: document.getElementById('newUserEmail').value,
                role: document.getElementById('newUserRole').value,
                status: document.getElementById('newUserStatus').value,
                // Password is not stored in this client-side simulation
            };
            users.push(newUser);
            renderUsers();
            addNewUserModal.style.display = 'none';
            alert(`New user ${newUser.name} added (simulated)!`);
        });
    }

    // Filter and Sort Logic (reusing from script.js where possible)
    const getAdminColumnIndex = (column) => {
        const columns = ['name', 'email', 'role', 'status'];
        return columns.indexOf(column);
    };

    const applyUserFilters = (tableId) => {
        const table = document.getElementById(tableId);
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const roleFilter = document.getElementById('userRoleFilter').value;
        const statusFilter = document.getElementById('userStatusFilter').value;

        const filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
        renderUsers(filtered);
    };

    const resetUserFilters = (tableId) => {
        document.getElementById('userSearch').value = '';
        document.getElementById('userRoleFilter').selectedIndex = 0;
        document.getElementById('userStatusFilter').selectedIndex = 0;
        renderUsers(); // Render all users
    };

    // Initial render
    renderUsers();

    // Setup filtering for user management table
    document.getElementById('applyUserFilters').addEventListener('click', () => applyUserFilters('userManagementTable'));
    document.getElementById('resetUserFilters').addEventListener('click', () => resetUserFilters('userManagementTable'));

    // Setup sorting for user management table (reusing sortTable from script.js)
    const userTable = document.getElementById('userManagementTable');
    if (userTable) {
        const sortableHeaders = userTable.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.dataset.sort;
                const isAscending = !header.classList.contains('sorted-asc');

                sortableHeaders.forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

                // Sort the 'users' array directly
                users.sort((a, b) => {
                    let aVal = a[sortBy];
                    let bVal = b[sortBy];

                    if (sortBy === 'role' || sortBy === 'status') {
                        const order = { 'admin': 3, 'technician': 2, 'client': 1, 'active': 2, 'inactive': 1 };
                        aVal = order[aVal];
                        bVal = order[bVal];
                    }

                    if (typeof aVal === 'string') {
                        return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                    }
                    return isAscending ? aVal - bVal : bVal - aVal;
                });
                renderUsers(); // Re-render with sorted data
            });
        });
    }
});
