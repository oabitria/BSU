const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.postProduct = (req, res) => {
    const { name, price, seller } = req.body;
    const imageName = req.file ? req.file.originalname : null; // Ensure req.file is not undefined

    console.log("Product Name:", name);
    console.log("Product Price:", price);
    console.log("Product Seller:", seller);
    console.log("Image Name:", imageName); // Log the image name

    if (!imageName) {
        return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    db.query('INSERT INTO products (name, price, seller, image_name) VALUES (?, ?, ?, ?)',
             [name, price, seller, imageName], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: 'Error posting product.' });
        }
        const productId = results.insertId;
        // Fetch the newly inserted product to return it
        db.query('SELECT * FROM products WHERE id = ?', [productId], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ success: false, message: 'Error fetching product.' });
            }
            res.json({ success: true, message: 'Product posted successfully.', product: results[0] });
        });
    });
};



exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ success: false, message: 'Error fetching products.' });
        }
        res.json({ success: true, products: results });
    });
};