const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { multer, uploadToDropbox } = require('../storage'); // Import Dropbox configuration

// Function to convert Dropbox shared link to direct link
function convertToDirectLink(sharedLink) {
    return sharedLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
}

// Post Product Route
router.post('/post-product', multer.single('image'), async (req, res) => {
    try {
        const response = await uploadToDropbox(req.file);
        let imageUrl = response.result.path_display; // Ensure this is the correct path

        // Convert to direct link if necessary
        if (imageUrl.includes('www.dropbox.com')) {
            imageUrl = convertToDirectLink(imageUrl);
        }

        console.log('Dropbox image URL:', imageUrl); // Log the image URL
        req.body.imageUrl = imageUrl;
        productController.postProduct(req, res);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file', details: error.message });
    }
});

// Fetch All Products Route
router.get('/all', productController.getAllProducts);

module.exports = router;
