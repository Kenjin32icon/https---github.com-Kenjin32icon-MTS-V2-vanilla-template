// server.js
        require('dotenv').config(); // Load environment variables from .env file
        const express = require('express');
        const { Pool } = require('pg');
        const cors = require('cors');

        const app = express();
        const port = process.env.PORT || 3000;

        // PostgreSQL Connection Pool
        const pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
        });

        // Middleware
        app.use(cors()); // Enable CORS for frontend
        app.use(express.json()); // Parse JSON request bodies

        // Test Database Connection
        pool.connect((err, client, done) => {
            if (err) {
                console.error('Database connection failed:', err.stack);
                return;
            }
            console.log('Successfully connected to PostgreSQL database!');
            client.release(); // Release the client back to the pool
        });

        // --- API Endpoints (Examples) ---

        // Get all users
        app.get('/api/users', async (req, res) => {
            try {
                const result = await pool.query('SELECT id, name, email, role, status, last_login FROM users');
                res.json(result.rows);
            } catch (err) {
                console.error('Error fetching users:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Add a new user (simplified, password hashing would be done here)
        app.post('/api/users', async (req, res) => {
            const { name, email, password, role, status } = req.body;
            // In a real app, hash the password here: const password_hash = await bcrypt.hash(password, 10);
            const password_hash = password; // Placeholder for now
            const id = `user-${Date.now()}`; // Simple ID generation

            try {
                const result = await pool.query(
                    'INSERT INTO users (id, name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [id, name, email, password_hash, role, status]
                );
                res.status(201).json(result.rows[0]);
            } catch (err) {
                console.error('Error adding user:', err);
                res.status(500).json({ error: 'Internal Server Error', details: err.message });
            }
        });

        // Update user role and status
        app.put('/api/users/:id', async (req, res) => {
            const { id } = req.params;
            const { role, status } = req.body;
            try {
                const result = await pool.query(
                    'UPDATE users SET role = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
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

        // Delete a user
        app.delete('/api/users/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(204).send(); // No Content
            } catch (err) {
                console.error('Error deleting user:', err);
                res.status(500).json({ error: 'Internal Server Error', details: err.message });
            }
        });

        // ... Add more API endpoints for generators, services, parts, etc. ...
        // Example for getting generators:
        app.get('/api/generators', async (req, res) => {
            try {
                const result = await pool.query('SELECT * FROM generators');
                res.json(result.rows);
            } catch (err) {
                console.error('Error fetching generators:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });


        // Start the server
        app.listen(port, () => {
            console.log(`Backend server listening at http://localhost:${port}`);
        });