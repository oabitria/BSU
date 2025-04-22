const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { multer, uploadToDropbox } = require('../storage'); // Import Dropbox configuration

// Post Product Route
router.post('/post-product', multer.single('image'), async (req, res) => {
    try {
        const response = await uploadToDropbox(req.file);
        req.body.imageUrl = response.result.path_display; // Ensure this is the correct path
        productController.postProduct(req, res);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file', details: error.message });
    }
});

// Fetch All Products Route
router.get('/all', productController.getAllProducts);

module.exports = router;
