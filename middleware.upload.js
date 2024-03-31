const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const historyDir = process.env.HISTORY_DIR_NAME || "history";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + `/${historyDir}/`);
  },
  filename: (req, file, cb) => {
    console.log(`persist history (${req.body.id}): ${file.originalname}`);
    cb(null, `${req.body.id}_${file.originalname}`);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;