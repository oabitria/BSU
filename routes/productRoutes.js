const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Ensure this line is correct
    }
});

const upload = multer({ storage: storage });





// Post Product Route
router.post('/post-product', upload.single('image'), productController.postProduct);

// Fetch All Products Route
router.get('/all', productController.getAllProducts);


module.exports = router;

//