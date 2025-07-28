-- Create tables
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT UNIQUE,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE generators (
    id SERIAL PRIMARY KEY,
    model TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Diesel', 'Gasoline', 'Natural Gas')),
    serial_number TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    purchase_date DATE,
    hours_run INTEGER DEFAULT 0,
    next_service_date DATE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('Technician', 'Supervisor', 'Admin')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    certification TEXT,
    team TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    part_number TEXT UNIQUE NOT NULL,
    description TEXT,
    quantity_in_stock INTEGER DEFAULT 0,
    cost_per_unit DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    generator_id INTEGER REFERENCES generators(id) ON DELETE SET NULL,
    service_date DATE NOT NULL,
    next_service_date DATE,
    technician_id INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('Completed', 'Pending', 'Overdue')) DEFAULT 'Pending',
    duration DECIMAL(4,1),
    type TEXT,
    work_order TEXT,
    service_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_parts (
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    quantity_used INTEGER NOT NULL CHECK (quantity_used > 0),
    PRIMARY KEY (service_id, part_id)
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE generators ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_parts ENABLE ROW LEVEL SECURITY;

-- Create views for common queries
CREATE VIEW client_generators AS
SELECT 
    g.id,
    g.model,
    g.serial_number,
    g.location,
    g.purchase_date,
    g.hours_run,
    g.next_service_date,
    c.id AS client_id,
    c.name AS client_name,
    (SELECT service_date FROM services 
     WHERE generator_id = g.id 
     ORDER BY service_date DESC LIMIT 1) AS last_service_date,
    (SELECT status FROM services 
     WHERE generator_id = g.id 
     ORDER BY service_date DESC LIMIT 1) AS last_service_status
FROM generators g
JOIN clients c ON g.client_id = c.id;

CREATE VIEW upcoming_services AS
SELECT 
    s.id AS service_id,
    s.service_date,
    s.next_service_date,
    s.status,
    g.model AS generator_model,
    g.serial_number,
    t.name AS technician_name,
    g.location
FROM services s
JOIN generators g ON s.generator_id = g.id
LEFT JOIN technicians t ON s.technician_id = t.id
WHERE s.status IN ('Pending', 'Overdue')
ORDER BY s.service_date;

-- Create indexes for performance
CREATE INDEX idx_generators_client_id ON generators(client_id);
CREATE INDEX idx_services_generator_id ON services(generator_id);
CREATE INDEX idx_services_technician_id ON services(technician_id);
CREATE INDEX idx_service_parts_service_id ON service_parts(service_id);
CREATE INDEX idx_service_parts_part_id ON service_parts(part_id);