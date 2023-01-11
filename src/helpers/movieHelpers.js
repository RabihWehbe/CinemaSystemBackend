const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'src/uploads/movies');
    },
    filename : (req,file,cb) => {
        const mimeType = file.mimetype.split('/');
        const fileType = mimeType[1];
        const filename = file.originalname;
        cb(null,filename);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storage = multer({ storage: diskStorage , fileFilter : fileFilter }).single('image');

module.exports = storage;