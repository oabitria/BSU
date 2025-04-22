const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { multer, uploadToDropbox } = require('../storage'); // Import Dropbox configuration

// Post Product Route
router.post('/post-product', multer.single('image'), async (req, res) => {
    try {
        const imageUrl = await uploadToDropbox(req.file);
        req.body.imageUrl = imageUrl.path_display; // Store the Dropbox file path
        productController.postProduct(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Fetch All Products Route
router.get('/all', productController.getAllProducts);

module.exports = router;
