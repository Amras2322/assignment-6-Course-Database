const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./database/university.db');

// GET all courses
app.get('/api/courses', (_req, res) => {
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET single course by ID
app.get('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(row);
    });
});

// POST new course
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        `INSERT INTO courses (courseCode, title, credits, description, semester)
         VALUES (?, ?, ?, ?, ?)`,
        [courseCode, title, credits, description, semester],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

// PUT update course
app.put('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        `UPDATE courses 
         SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? 
         WHERE id = ?`,
        [courseCode, title, credits, description, semester, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json({ message: 'Course updated' });
        }
    );
});

// DELETE course
app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM courses WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});