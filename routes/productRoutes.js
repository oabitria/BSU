const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { multer, uploadToDropbox } = require('../storage'); // Import Dropbox configuration

// Post Product Route
router.post('/post-product', multer.single('image'), async (req, res) => {
    try {
        const response = await uploadToDropbox(req.file);

        // Ensure the response is valid and contains the directLink
        if (response && response.result && response.result.directLink) {
            req.body.imageUrl = response.result.directLink; // Use the direct link
            console.log('Dropbox image URL:', req.body.imageUrl); // Log the image URL
            productController.postProduct(req, res);
        } else {
            throw new Error('Invalid response from Dropbox');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file', details: error.message });
    }
});

// Fetch All Products Route
router.get('/all', productController.getAllProducts);

module.exports = router;
