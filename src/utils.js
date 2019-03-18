const multer = require("koa-multer");
const nanoid = require("nanoid");
const path = require("path");

//文件上传
//配置
function multerConfig(dir) {
  return multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, dir));
    },
    //修改文件名称
    filename: function(req, file, cb) {
      //以点分割成数组，数组的最后一项就是后缀名
      const fileFormat = file.originalname.split(".");
      cb(null, nanoid() + "." + fileFormat[fileFormat.length - 1]);
    }
  });
}

const defaultUpload = multer({ storage: multerConfig("../static/image") });

module.exports = {
  defaultUpload,
}
