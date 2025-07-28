// data.js - Centralized simulated data

export let users = [
    { id: 'user-001', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'admin', status: 'active', lastLogin: '2024-05-20' },
    { id: 'user-002', name: 'Bob Williams', email: 'bob.w@example.com', role: 'technician', status: 'active', lastLogin: '2024-05-21' },
    { id: 'user-003', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'client', status: 'active', lastLogin: '2024-05-19' },
    { id: 'user-004', name: 'Diana Prince', email: 'diana.p@example.com', role: 'technician', status: 'inactive', lastLogin: '2024-04-10' },
    { id: 'user-005', name: 'Eve Adams', email: 'eve.a@example.com', role: 'client', status: 'active', lastLogin: '2024-05-22' },
];

export let services = [
    {
        id: 'SRV-001', generator: 'GenPro X100', date: '2024-03-10', next: '2024-09-10', tech: 'John Doe', status: 'completed',
        duration: '2.5 hours', type: 'Scheduled Maintenance', serial: 'SN-GPX100-001', location: 'Warehouse A', hoursRun: '1,250 hrs',
        techContact: 'john.doe@example.com', techTeam: 'Maintenance Crew A', techCertification: 'Level 3 Generator Tech',
        serviceCost: '$350.00', workOrder: 'WO-2024-001',
        partsUsed: [
            { name: 'Oil Filter', partNo: 'OF-12345', qty: 2, unitCost: 15.00 },
            { name: 'Air Filter', partNo: 'AF-67890', qty: 1, unitCost: 25.00 },
            { name: 'Synthetic Oil', partNo: 'SO-5W30', qty: 5, unitCost: 12.00 },
            { name: 'Spark Plugs', partNo: 'SP-456', qty: 4, unitCost: 8.00 }
        ],
        notes: 'Generator was running smoothly with no abnormal vibrations. Oil change completed, filters replaced, and all connections checked. Battery tested at 95% capacity. Recommend monitoring oil consumption over next 100 hours.'
    },
    {
        id: 'SRV-002', generator: 'PowerGen 5000', date: '2024-04-05', next: '2024-10-05', tech: 'Jane Smith', status: 'pending',
        duration: '3 hours', type: 'Emergency Repair', serial: 'SN-PG5000-002', location: 'Site B', hoursRun: '2,100 hrs',
        techContact: 'jane.smith@example.com', techTeam: 'Field Team Alpha', techCertification: 'Level 2 Generator Tech',
        serviceCost: '$500.00', workOrder: 'WO-2024-002',
        partsUsed: [],
        notes: 'Generator reported unusual noise. Investigation pending. Technician dispatched.'
    },
    {
        id: 'SRV-003', generator: 'EcoPower 3000', date: '2024-04-15', next: '2024-10-15', tech: 'Robert Johnson', status: 'overdue',
        duration: '1.5 hours', type: 'Minor Adjustment', serial: 'SN-EP3000-003', location: 'Main Office', hoursRun: '800 hrs',
        techContact: 'robert.j@example.com', techTeam: 'Inspection Unit', techCertification: 'Level 3 Generator Tech',
        serviceCost: '$150.00', workOrder: 'WO-2024-003',
        partsUsed: [],
        notes: 'Minor fuel line adjustment required. Service overdue due to parts delay.'
    },
    {
        id: 'SRV-004', generator: 'GenPro X200', date: '2024-05-02', next: '2024-11-02', tech: 'Emily Davis', status: 'completed',
        duration: '2 hours', type: 'Scheduled Maintenance', serial: 'SN-GPX200-004', location: 'Warehouse C', hoursRun: '1,500 hrs',
        techContact: 'emily.d@example.com', techTeam: 'Maintenance Crew B', techCertification: 'Level 2 Generator Tech',
        serviceCost: '$300.00', workOrder: 'WO-2024-004',
        partsUsed: [],
        notes: 'Routine check-up and minor adjustments. All systems nominal.'
    },
    {
        id: 'SRV-005', generator: 'PowerGen 7000', date: '2024-05-18', next: '2024-11-18', tech: 'Michael Brown', status: 'pending',
        duration: '4 hours', type: 'Major Overhaul', serial: 'SN-PG7000-005', location: 'Remote Site D', hoursRun: '3,500 hrs',
        techContact: 'michael.b@example.com', techTeam: 'Field Team Beta', techCertification: 'Level 3 Generator Tech',
        serviceCost: '$1200.00', workOrder: 'WO-2024-005',
        partsUsed: [],
        notes: 'Scheduled major overhaul. Requires specialized tools and parts.'
    },
    // Schedule specific services (for calendar)
    {
        id: 'SCH-001', date: '2024-05-10', time: '10:00 AM', type: 'Oil Change', status: 'completed',
        generator: 'GenPro X100', serial: 'SN-GPX100-001', location: 'Warehouse A', lastService: '2024-03-10',
        technician: 'John Doe', team: 'Maintenance Crew A', contact: 'john.doe@example.com', priority: 'Medium',
        duration: '1.5 hours', parts: 'Oil Filter, 5L Synthetic Oil', notes: 'Routine oil and filter change. Generator running well.'
    },
    {
        id: 'SCH-002', date: '2024-05-15', time: '01:30 PM', type: 'Filter Replacement', status: 'pending',
        generator: 'PowerGen 5000', serial: 'SN-PG5000-002', location: 'Site B', lastService: '2024-02-20',
        technician: 'Jane Smith', team: 'Field Team Alpha', contact: 'jane.smith@example.com', priority: 'High',
        duration: '2 hours', parts: 'Air Filter, Fuel Filter', notes: 'Scheduled replacement of air and fuel filters. Check for debris.'
    },
    {
        id: 'SCH-003', date: '2024-05-20', time: '09:00 AM', type: 'Full Inspection', status: 'overdue',
        generator: 'EcoPower 3000', serial: 'SN-EP3000-003', location: 'Main Office', lastService: '2023-11-01',
        technician: 'Robert Johnson', team: 'Inspection Unit', contact: 'robert.j@example.com', priority: 'Critical',
        duration: '3 hours', parts: 'N/A', notes: 'Comprehensive annual inspection. Overdue by 2 weeks. Prioritize.'
    },
    {
        id: 'SCH-004', date: '2024-06-05', time: '11:00 AM', type: 'Battery Check', status: 'pending',
        generator: 'GenPro X200', serial: 'SN-GPX200-004', location: 'Warehouse C', lastService: '2024-04-01',
        technician: 'Emily Davis', team: 'Maintenance Crew B', contact: 'emily.d@example.com', priority: 'Medium',
        duration: '1 hour', parts: 'N/A', notes: 'Check battery fluid levels and terminal connections.'
    },
    {
        id: 'SCH-005', date: '2024-06-12', time: '02:00 PM', type: 'Coolant Flush', status: 'pending',
        generator: 'PowerGen 7000', serial: 'SN-PG7000-005', location: 'Remote Site D', lastService: '2024-01-15',
        technician: 'Michael Brown', team: 'Field Team Beta', contact: 'michael.b@example.com', priority: 'High',
        duration: '2.5 hours', parts: 'Coolant, Distilled Water', notes: 'Full coolant system flush and refill.'
    }
];

export let parts = [
    { id: 'part-001', name: 'Oil Filter', number: 'OF-12345', quantity: 50, cost: 15.00, status: 'In Stock', category: 'Filters', description: 'Standard oil filter for GenPro X100 series.', minStock: 10, supplier: 'FilterCo', lastOrdered: '2024-04-01', usedLastMonth: 15, compatibleGens: 'GenPro X100, GenPro X200', location: 'Warehouse Shelf A3', reorderPoint: 15, leadTime: '3-5 business days', notes: 'Ensure regular stock checks. Consider bulk ordering for cost savings.' },
    { id: 'part-002', name: 'Spark Plug', number: 'SP-67890', quantity: 120, cost: 5.50, status: 'In Stock', category: 'Electrical', description: 'High-performance spark plug.', minStock: 20, supplier: 'SparkGen', lastOrdered: '2024-03-15', usedLastMonth: 20, compatibleGens: 'All Models', location: 'Warehouse Shelf B1', reorderPoint: 30, leadTime: '2-3 business days', notes: '' },
    { id: 'part-003', name: 'Air Filter', number: 'AF-98765', quantity: 8, cost: 25.00, status: 'Low Stock', category: 'Filters', description: 'Heavy-duty air filter.', minStock: 10, supplier: 'FilterCo', lastOrdered: '2024-05-01', usedLastMonth: 5, compatibleGens: 'EcoPower 3000', location: 'Warehouse Shelf A4', reorderPoint: 10, leadTime: '5-7 business days', notes: 'Urgent reorder needed.' },
    { id: 'part-004', name: 'Synthetic Oil (5L)', number: 'SO-5W30', quantity: 3, cost: 60.00, status: 'Low Stock', category: 'Fluids', description: 'Premium synthetic engine oil.', minStock: 5, supplier: 'LubriMax', lastOrdered: '2024-04-20', usedLastMonth: 3, compatibleGens: 'All Diesel Models', location: 'Warehouse Shelf C2', reorderPoint: 5, leadTime: '3-4 business days', notes: 'Critical item, always keep stock.' },
];

export let generators = [
    { id: 'gen-001', model: 'GenPro X100', type: 'Diesel', serial: 'SN-GPX100-001', location: 'Warehouse A', purchaseDate: '2022-01-15', warrantyEnd: '2025-01-15', supplier: 'Global Power Inc.', cost: 15000, totalHoursRun: 1250, lastService: '2024-03-10', nextService: '2024-09-10', status: 'Active', client: 'ABC Corp', contact: 'jane.doe@abccorp.com', clientId: 'CLI-001', assignedTech: 'John Doe', notes: 'Initial setup completed without issues. Generator is primary backup for critical systems. Regular load testing recommended.' },
    { id: 'gen-002', model: 'PowerGen 5000', type: 'Gasoline', serial: 'SN-PG5000-002', location: 'Site B', purchaseDate: '2023-03-20', warrantyEnd: '2026-03-20', supplier: 'PowerGen Solutions', cost: 12000, totalHoursRun: 2100, lastService: '2024-04-05', nextService: '2024-10-05', status: 'Active', client: 'XYZ Ltd', contact: 'bob.s@xyzltd.com', clientId: 'CLI-002', assignedTech: 'Jane Smith', notes: 'Used for remote site operations. Requires quarterly fuel checks.' },
    { id: 'gen-003', model: 'EcoPower 3000', type: 'Natural Gas', serial: 'SN-EP3000-003', location: 'Main Office', purchaseDate: '2021-11-01', warrantyEnd: '2024-11-01', supplier: 'EcoEnergy Systems', cost: 18000, totalHoursRun: 800, lastService: '2024-04-15', nextService: '2024-10-15', status: 'Under Maintenance', client: 'GreenTech Innovations', contact: 'sara.m@greentech.com', clientId: 'CLI-003', assignedTech: 'Robert Johnson', notes: 'Eco-friendly model. Currently undergoing minor repairs.' },
];

export let technicians = [
    { id: 'tech-001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St, Anytown', employeeId: 'EMP-001', role: 'Technician', hireDate: '2020-05-10', team: 'Maintenance Crew A', status: 'Active', assignedServices: 15, completedServicesMo: 10, certifications: 'Level 3 Generator Tech, Electrical Safety', specialties: 'Diesel Generators, Troubleshooting', notes: 'Consistently high performer. Excellent problem-solving skills. Needs to renew Electrical Safety certification by end of year.' },
    { id: 'tech-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+0987654321', address: '456 Oak Ave, Otherville', employeeId: 'EMP-002', role: 'Supervisor', hireDate: '2018-08-20', team: 'Field Team Alpha', status: 'Active', assignedServices: 12, completedServicesMo: 8, certifications: 'Level 4 Generator Master, Project Management', specialties: 'Gasoline Generators, Team Lead', notes: 'Manages Field Team Alpha. Strong leadership skills.' },
    { id: 'tech-003', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '+1122334455', address: '789 Pine Ln, Somewhere', employeeId: 'EMP-003', role: 'Technician', hireDate: '2021-01-05', team: 'Inspection Unit', status: 'Inactive', assignedServices: 8, completedServicesMo: 5, certifications: 'Level 2 Generator Tech', specialties: 'Natural Gas Generators', notes: 'Currently on leave. Expected back next quarter.' },
    { id: 'tech-004', name: 'Emily Davis', email: 'emily.d@example.com', phone: '+9988776655', address: '101 Elm St, Anytown', employeeId: 'EMP-004', role: 'Technician', hireDate: '2022-03-01', team: 'Maintenance Crew B', status: 'Active', assignedServices: 10, completedServicesMo: 7, certifications: 'Level 1 Generator Tech', specialties: 'Preventive Maintenance', notes: 'Newest team member, learning quickly.' },
    { id: 'tech-005', name: 'Michael Brown', email: 'michael.b@example.com', phone: '+5544332211', address: '202 Birch Rd, Otherville', employeeId: 'EMP-005', role: 'Technician', hireDate: '2019-11-11', team: 'Field Team Beta', status: 'Active', assignedServices: 14, completedServicesMo: 12, certifications: 'Level 3 Generator Tech, Advanced Diagnostics', specialties: 'Emergency Repairs, Large Generators', notes: 'Highly experienced, handles critical assignments.' },
];

// Permissions for each role (used in admin panel)
export const rolePermissions = {
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
