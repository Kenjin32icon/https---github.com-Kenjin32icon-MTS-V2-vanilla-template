-- scheme.sql - PostgreSQL Database Schema for GenMaint Pro

-- Table for Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords, never plain text
    role VARCHAR(50) NOT NULL, -- 'admin', 'technician', 'client'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'limited', 'suspended'
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Generators
CREATE TABLE IF NOT EXISTS generators (
    id VARCHAR(50) PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Diesel', 'Gasoline', 'Natural Gas', 'Propane'
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(255),
    purchase_date DATE,
    warranty_end_date DATE,
    supplier VARCHAR(100),
    cost NUMERIC(10, 2),
    total_hours_run INTEGER DEFAULT 0,
    last_service_date DATE,
    next_service_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Under Maintenance'
    client_id VARCHAR(50), -- Foreign key to users table (if client is a user)
    assigned_tech_id VARCHAR(50), -- Foreign key to users table (if technician is a user)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client
        FOREIGN KEY (client_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_assigned_tech
        FOREIGN KEY (assigned_tech_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Table for Service Records (combines SRV- and SCH- from data.js)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    generator_id VARCHAR(50) NOT NULL, -- Foreign key to generators table
    service_date DATE NOT NULL,
    service_time TIME, -- For scheduled services
    service_type VARCHAR(100) NOT NULL, -- 'Scheduled Maintenance', 'Emergency Repair', 'Oil Change', 'Filter Replacement', etc.
    technician_id VARCHAR(50) NOT NULL, -- Foreign key to users table (technician role)
    status VARCHAR(50) NOT NULL, -- 'completed', 'pending', 'overdue'
    duration VARCHAR(50), -- e.g., '2.5 hours'
    next_service_date DATE,
    service_cost NUMERIC(10, 2),
    work_order_number VARCHAR(100),
    notes TEXT,
    priority VARCHAR(50), -- 'Low', 'Medium', 'High', 'Critical' (for scheduled services)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_generator
        FOREIGN KEY (generator_id)
        REFERENCES generators(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_technician
        FOREIGN KEY (technician_id)
        REFERENCES users(id)
        ON DELETE RESTRICT -- Prevent deleting technician if they have assigned services
);

-- Table for Parts Inventory
CREATE TABLE IF NOT EXISTS parts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    cost_per_unit NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Stock', -- 'In Stock', 'Low Stock', 'Out of Stock'
    category VARCHAR(100),
    description TEXT,
    min_stock_level INTEGER DEFAULT 0,
    preferred_supplier VARCHAR(100),
    last_ordered_date DATE,
    units_used_last_month INTEGER DEFAULT 0,
    compatible_generators TEXT, -- Comma-separated list of generator models
    warehouse_location VARCHAR(100),
    reorder_point INTEGER,
    lead_time_days VARCHAR(50), -- e.g., '3-5 business days'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Service_Parts (Junction table for many-to-many relationship between services and parts)
CREATE TABLE IF NOT EXISTS service_parts (
    service_id VARCHAR(50) NOT NULL,
    part_id VARCHAR(50) NOT NULL,
    quantity_used INTEGER NOT NULL,
    unit_cost_at_time NUMERIC(10, 2), -- Cost at the time of service
    PRIMARY KEY (service_id, part_id),
    CONSTRAINT fk_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_part
        FOREIGN KEY (part_id)
        REFERENCES parts(id)
        ON DELETE RESTRICT -- Prevent deleting part if it's used in a service record
);

-- Table for Technician_Certifications (if certifications need to be managed separately)
-- For now, keeping certifications in the users table as a text field for simplicity,
-- but this table would be used for more granular management.
/*
CREATE TABLE IF NOT EXISTS technician_certifications (
    id SERIAL PRIMARY KEY,
    technician_id VARCHAR(50) NOT NULL,
    certification_name VARCHAR(100) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    issuing_body VARCHAR(100),
    CONSTRAINT fk_tech_cert
        FOREIGN KEY (technician_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
*/

-- Indexes for faster lookups
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_generators_serial ON generators (serial_number);
CREATE INDEX idx_generators_client_id ON generators (client_id);
CREATE INDEX idx_services_generator_id ON services (generator_id);
CREATE INDEX idx_services_technician_id ON services (technician_id);
CREATE INDEX idx_services_date ON services (service_date);
CREATE INDEX idx_parts_part_number ON parts (part_number);
CREATE INDEX idx_parts_category ON parts (category);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamp on row modification
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_generators_timestamp
BEFORE UPDATE ON generators
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_parts_timestamp
BEFORE UPDATE ON parts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Initial Data (Optional, for development/testing)
-- You would typically insert initial data via your application or a separate seed script.
-- Example:
-- INSERT INTO users (id, name, email, password_hash, role, status) VALUES
-- ('user-001', 'Alice Johnson', 'alice.j@example.com', 'hashed_password_admin', 'admin', 'active'),
-- ('user-002', 'Bob Williams', 'bob.w@example.com', 'hashed_password_tech', 'technician', 'active'),
-- ('user-003', 'Charlie Brown', 'charlie.b@example.com', 'hashed_password_client', 'client', 'active');

-- INSERT INTO generators (id, model, type, serial_number, location, purchase_date, client_id, assigned_tech_id, status) VALUES
-- ('gen-001', 'GenPro X100', 'Diesel', 'SN-GPX100-001', 'Warehouse A', '2022-01-15', 'user-003', 'user-002', 'Active');

-- INSERT INTO services (id, generator_id, service_date, service_type, technician_id, status, notes) VALUES
-- ('SRV-001', 'gen-001', '2024-03-10', 'Scheduled Maintenance', 'user-002', 'completed', 'Routine check.');

-- INSERT INTO parts (id, name, part_number, quantity_in_stock, cost_per_unit, status) VALUES
-- ('part-001', 'Oil Filter', 'OF-12345', 50, 15.00, 'In Stock');

-- INSERT INTO service_parts (service_id, part_id, quantity_used, unit_cost_at_time) VALUES
-- ('SRV-001', 'part-001', 2, 15.00);