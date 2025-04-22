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
    return sharedLink
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('dropbox.com', 'dl.dropboxusercontent.com')
        .replace('?dl=0', '')
        .replace(/(\?rlkey=.*)$/, '');
}


// Function to upload a file to Dropbox
const uploadToDropbox = async (file) => {
    if (!file) return null;

    const filePath = `${process.env.DROPBOX_UPLOAD_PATH}/${file.originalname}`;
    const fileData = file.buffer;

    try {
        // Upload file
        await dbx.filesUpload({ path: filePath, contents: fileData });

        // Look for existing shared links
        const links = await dbx.sharingListSharedLinks({
            path: filePath,
            direct_only: true,
        });

        let url;

        if (links.result.links.length > 0) {
            url = links.result.links[0].url;
        } else {
            // If no existing link, create a new one
            const newLink = await dbx.sharingCreateSharedLinkWithSettings({ path: filePath });
            url = newLink.result.url;
        }

        const directLink = convertToDirectLink(url);
        return { success: true, result: { directLink } };

    } catch (error) {
        console.error('Dropbox upload error:', error);
        throw new Error('Failed to upload file to Dropbox');
    }
};


module.exports = { multer, uploadToDropbox };
