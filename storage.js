const { Dropbox } = require('dropbox');
const Multer = require('multer');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
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

// Function to upload a file to Dropbox
const uploadToDropbox = async (file, retries = 3, delay = 1000) => {
    if (!file) {
        return null;
    }

    const filePath = `${process.env.DROPBOX_UPLOAD_PATH}/${file.originalname}`;
    const fileData = file.buffer;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await dbx.filesUpload({ path: filePath, contents: fileData });
            return response;
        } catch (error) {
            if (attempt < retries - 1) {
                console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Detailed error:', error);
                throw new Error('Failed to upload file to Dropbox after multiple attempts');
            }
        }
    }
};


module.exports = { multer, uploadToDropbox };
