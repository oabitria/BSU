const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;

    // Hash the password before storing
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Debugging line

    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log("User registered successfully:", results);
            return res.render('register', {
                message: 'User Registered'
            });
        }
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", { message: "Please enter email and password" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Database query error.");
        }

        if (results.length === 0) {
            return res.render("login", { message: "Email not found. Please register first." });
        }

        const user = results[0];
        console.log("User found:", user); // Debugging line

        // Compare hashed password with entered password
        const isMatch = await bcryptjs.compare(password, user.password);
        console.log("Password Match:", isMatch); // Debugging line

        if (!isMatch) {
            return res.render("login", { message: "Incorrect password. Please try again." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

        return res.redirect("/market");
    });
};

// POST logout route
exports.logout = (req, res) => {
    // Clear the JWT cookie
    res.clearCookie("jwt");
    return res.redirect("/");  // Redirect to home page after logging out
};


// localhost/phpmyadmin