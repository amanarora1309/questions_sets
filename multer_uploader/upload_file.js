import multer from 'multer';
import path from 'path';





const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        // console.log("in multer");
        // console.log(file);
        console.log("file print karde bhai");
        console.log(file);

        req['file_name'] = file.originalname;

        callback(null, file.originalname);
    },
    // filename: function (req, file, cb) {
    //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //     cb(null, uniqueSuffix + path.extname(file.originalname));
    // },

});

const upload = multer({ storage: storage }); `x`

export default upload;











// if (file.mimetype.split('/')[1] !== 'png') {
//     return cb(new Error("Only pdf files are allowed"))
// }
// else {
//     cb(null, file.originalname);
// }
// }