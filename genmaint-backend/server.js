require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Test Database Connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Successfully connected to PostgreSQL database!');
  client.release();
});

// --- Authentication Endpoints ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const id = `user-${Date.now()}`;
    
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, status) 
       VALUES ($1, $2, $3, $4, $5, 'active') 
       RETURNING id, name, email, role, status`,
      [id, name, email, hashedPassword, role]
    );
    
    const newUser = result.rows[0];
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// --- Protected Routes ---
app.use(authenticateToken);

// --- API Endpoints ---

// Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, status, last_login FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, password, role, status } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const id = `user-${Date.now()}`;
    
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role, status`,
      [id, name, email, hashedPassword, role, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE users SET role = $1, status = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING id, name, email, role, status`,
      [role, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Generators
app.get('/api/generators', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, u.name as client_name, t.name as technician_name 
      FROM generators g
      LEFT JOIN users u ON g.client_id = u.id
      LEFT JOIN users t ON g.assigned_tech_id = t.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching generators:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/generators', async (req, res) => {
  const { model, type, serial_number, location, purchase_date, client_id, assigned_tech_id } = req.body;
  const id = `gen-${Date.now()}`;
  
  try {
    const result = await pool.query(
      `INSERT INTO generators (id, model, type, serial_number, location, purchase_date, client_id, assigned_tech_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, model, type, serial_number, location, purchase_date, client_id, assigned_tech_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding generator:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/generators/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM generators WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Generator not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting generator:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, g.model as generator_model, u.name as technician_name 
      FROM services s
      JOIN generators g ON s.generator_id = g.id
      JOIN users u ON s.technician_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/services', async (req, res) => {
  const { generator_id, service_date, service_type, technician_id, status, duration } = req.body;
  const id = `srv-${Date.now()}`;
  
  try {
    const result = await pool.query(
      `INSERT INTO services (id, generator_id, service_date, service_type, technician_id, status, duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, generator_id, service_date, service_type, technician_id, status, duration]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding service:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Parts
app.get('/api/parts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parts');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching parts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/parts', async (req, res) => {
  const { name, part_number, quantity_in_stock, cost_per_unit, category } = req.body;
  const id = `part-${Date.now()}`;
  
  try {
    const result = await pool.query(
      `INSERT INTO parts (id, name, part_number, quantity_in_stock, cost_per_unit, category, status)
       VALUES ($1, $2, $3, $4, $5, $6, 
         CASE WHEN $4 <= 0 THEN 'Out of Stock' 
              WHEN $4 <= 10 THEN 'Low Stock' 
              ELSE 'In Stock' END)
       RETURNING *`,
      [id, name, part_number, quantity_in_stock, cost_per_unit, category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding part:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/parts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM parts WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting part:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Technicians (Users with role 'technician')
app.get('/api/technicians', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'technician'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});