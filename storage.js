const { Dropbox } = require('dropbox').Dropbox; // Correct import statement
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Initialize Dropbox client
const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

async function uploadToDropbox(file) {
    const filePath = path.join(__dirname, 'uploads', file.originalname);
    const uploadPath = `/${file.originalname}`;

    // Move the file to the uploads directory
    fs.writeFileSync(filePath, file.buffer);

    try {
        // Upload the file to Dropbox
        const response = await dropbox.filesUpload({ path: uploadPath, contents: fs.createReadStream(filePath) });

        // Create a shared link for the uploaded file
        const sharedLink = await dropbox.sharingCreateSharedLinkWithSettings({ path: uploadPath });

        // Convert the shared link to a direct link
        const directLink = sharedLink.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');

        return { success: true, result: { directLink } };
    } catch (error) {
        console.error('Error uploading to Dropbox:', error);
        throw error;
    } finally {
        // Clean up the local file
        fs.unlinkSync(filePath);
    }
}

module.exports = { multer: upload, uploadToDropbox };
