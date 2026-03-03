const multer = require('multer');

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for general files
});

module.exports = upload;
