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
const uploadToDropbox = async (file) => {
    if (!file) {
        return null;
    }

    const filePath = `${process.env.DROPBOX_UPLOAD_PATH}/${file.originalname}`;
    const fileData = file.buffer;

    try {
        const response = await dbx.filesUpload({ path: filePath, contents: fileData });
        return response;
    } catch (error) {
        console.error('Detailed error:', error); // Log detailed error
        throw new Error('Failed to upload file to Dropbox');
    }
};


module.exports = { multer, uploadToDropbox };
