const mysql = require('mysql2');

// Set up MySQL connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

exports.placeOrder = (req, res) => {
    const { fullName, email, address, paymentMethod, totalAmount } = req.body;

    const sql = 'INSERT INTO orders (full_name, email, address, payment_method, total_amount) VALUES (?, ?, ?, ?, ?)';
    const values = [fullName, email, address, paymentMethod, totalAmount];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ success: false, message: 'Error processing order' });
            return;
        }
        res.json({ success: true, message: 'Order placed successfully' });
    });
};
