const fs = require("fs");
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT | 8080;
const baseUrl = `${host}:${port}/`;
const historyDir = process.env.HISTORY_DIR_NAME || "history";
const directoryPath = __basedir + `/${historyDir}/`;

const getHistoryAll = (req, res) => {
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
};

module.exports = {
    getHistoryAll,
};