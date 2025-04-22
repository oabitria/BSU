const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.postProduct = (req, res) => {
    const { name, price, seller, imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    db.query('INSERT INTO products (name, price, seller, image_url) VALUES (?, ?, ?, ?)',
             [name, price, seller, imageUrl], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error posting product.' });
        }
        const productId = results.insertId;
        db.query('SELECT * FROM products WHERE id = ?', [productId], (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error fetching product.' });
            }
            res.json({ success: true, message: 'Product posted successfully.', product: results[0] });
        });
    });
};

exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error fetching products.' });
        }
        res.json({ success: true, products: results });
    });
};
