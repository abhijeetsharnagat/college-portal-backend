// upload.js
const multer = require('multer');

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where the images will be stored
 },
 filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
 },
});

const upload = multer({ storage: storage });

module.exports = upload;
