const { Dropbox } = require('dropbox');
const Multer = require('multer');
require('dotenv').config();

// Initialize Dropbox client
const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
});

// Configure Multer to use memory storage
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Function to convert Dropbox shared link to direct link
function convertToDirectLink(sharedLink) {
    if (sharedLink && typeof sharedLink === 'string') {
        return sharedLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }
    throw new Error('Invalid shared link');
}

// Function to upload a file to Dropbox
const uploadToDropbox = async (file) => {
    if (!file) {
        return null;
    }

    const filePath = ${process.env.DROPBOX_UPLOAD_PATH}/${file.originalname};
    const fileData = file.buffer;

    try {
        // Upload the file to Dropbox
        const uploadResponse = await dbx.filesUpload({ path: filePath, contents: fileData });
        console.log('Upload response:', uploadResponse); // Log the upload response

        // Create a shared link for the uploaded file
        const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({ path: filePath });
        console.log('Shared link response:', sharedLinkResponse); // Log the shared link response

        if (sharedLinkResponse.result && sharedLinkResponse.result.url) {
            // Convert the shared link to a direct link
            const directLink = convertToDirectLink(sharedLinkResponse.result.url);
            return { success: true, result: { directLink } }; // Ensure the direct link is returned
        } else {
            throw new Error('Invalid shared link response');
        }
    } catch (error) {
        console.error('Detailed error:', error); // Log detailed error
        throw new Error('Failed to upload file to Dropbox');
    }
};

module.exports = { multer, uploadToDropbox };

