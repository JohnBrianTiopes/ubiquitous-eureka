const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Add this line

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production'; // Add this line

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ngilo.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the ngilo.db database.');
    }
});

db.run(` CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
    )`, (err) => {
    if (err) console.error("Error creating users table:", err.message);
});

db.run(`
    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id)
    )`, (err) => {
    if (err) console.error("Error creating messages table:", err.message);
});

app.post('/api/signup', async (req, res) => {
// Add authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
});
// Update Register endpoint
app.post('/api/Register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        
        db.run(
            `INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)`,
            [userId, username, hashedPassword],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send('Username already exists.');
                }
                // Create token for new user
                const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '1h' });
                res.status(200).send({ userId, username, token });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during signup');
    }
});

// Update Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error.');
        }
        if (!user) {
            return res.status(400).send('Invalid username or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password.');
        }

        // Create and return token
        const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ userId: user.user_id, username: user.username, token });
    });
});

// Protect this route with authentication middleware
app.get('/api/user/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;

    db.get(`SELECT username FROM users WHERE user_id = ?`, [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
        if (!row) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ username: row.username });
    });
});

// Protect this route
app.post('/api/send-message', authenticateToken, (req, res) => {
    const { recipientId, message } = req.body;

    if (!recipientId || !message) {
         return res.status(400).send('Recipient ID and message are required.');
    }

    db.get(`SELECT user_id FROM users WHERE user_id = ?`, [recipientId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server error.');
        }
        if (!row) {
            return res.status(404).send('Recipient user not found.');
        }

        db.run(
            `INSERT INTO messages (recipient_id, message) VALUES (?, ?)`,
            [recipientId, message],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Failed to send message.');
                }
                res.status(200).send('Message sent successfully.');
            }
        );
    });
});

// Protect this route
app.get('/api/messages/:userId', authenticateToken, (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT id, message, timestamp FROM messages WHERE recipient_id = ? ORDER BY timestamp DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to retrieve messages.');
            }
            res.status(200).json(rows);
        }
    );
});

// Protect this route
app.delete('/api/messages/:messageId', authenticateToken, (req, res) => {
    const { messageId } = req.params;

    db.run(
        `DELETE FROM messages WHERE id = ?`,
        [messageId],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Failed to delete message.');
            }
            if (this.changes === 0) {
                return res.status(404).send('Message not found.');
            }
            res.status(200).send('Message deleted successfully.');
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})