const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

dotenv.config({path: './.env'});
const authRoutes = require('./routes/auth'); // Adjust the path as needed
const productRoutes = require('./routes/productRoutes'); // Import product routes
const checkoutRoutes = require('./routes/checkout'); // Import the checkout routes

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('view engine', 'hbs');

db.connect( (error) =>{
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected.....")
    }
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/', require('./routes/pages.js'))
app.use('/auth', require('./routes/auth'));
app.use('/products', productRoutes);
app.use('/checkout', checkoutRoutes); // Use the new checkout routes


app.listen(5000, () => {
    console.log("Server started on Port 5000");
})


//npm install mysql2
