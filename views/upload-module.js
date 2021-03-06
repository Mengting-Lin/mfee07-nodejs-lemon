const multer = require('multer');

const {v4: uuidv4 } = require('uuid');

console.log(uuidv4());

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
}

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, __dirname + '/../public/img-uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, req.file.originalname)
    }
});

const fileFilter = (req, file, cb)=>{
    cb(null, !!extMap[file.mimetype]);
}

const upload = multer({storage, fileFilter});

module.exports = upload;