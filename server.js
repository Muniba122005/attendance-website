const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sams",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database.");
});

// Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).send("User not found.");

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).send("Invalid credentials.");

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ name: user.name, token });
    });
});

// Mark Attendance API
app.post("/api/mark-attendance", (req, res) => {
    const { userId, date } = req.body;
    const query = "INSERT INTO attendance (user_id, date) VALUES (?, ?)";
    db.query(query, [userId, date], (err) => {
        if (err) throw err;
        res.send("Attendance marked successfully.");
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
