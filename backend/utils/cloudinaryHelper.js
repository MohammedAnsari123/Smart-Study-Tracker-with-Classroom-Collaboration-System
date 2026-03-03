const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary using upload_stream.
 * @param {Buffer} buffer - The file buffer from Multer.
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto', // Automatically detect file type (image, video, raw/pdf)
                folder: 'smart-study-tracker' // Optional: organized folder
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

module.exports = { uploadToCloudinary };
