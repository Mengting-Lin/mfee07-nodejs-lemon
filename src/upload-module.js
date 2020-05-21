
//透過fs & uuid搬移並重新命名上傳檔案
 
// 匯入multer
const multer = require ('multer');

// uuid：隨機檔名
const {v4: uuidv4 } = require('uuid');
console.log(uuidv4());

// 設定各種mimetype欲回傳之附檔名
const extMap = {
    'image/jpeg':'.jpg',
    'image/png':'.png',
    'image/gif':'.gif',
}

// diskStorage
 let storage = multer.diskStorage ({
     // destination
    destination: (req, file, cb)=>{
        cb(null, __dirname + '/../public/img-uploads')
    },
    // filename
    filename: (req, file, cb)=>{
        // cb(null, req.file.originalname)
        let ext = extMap[file.mimetype];
        cb(null, uuidv4() + ext)
    }
 });

// 過濾不符合的檔案類型
const fileFilter = (req, file, cb)=>{
    cb(null, !!extMap[file.mimetype]);
}

// storage
const upload = multer({storage, fileFilter});

module.exports = upload;