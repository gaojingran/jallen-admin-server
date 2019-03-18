const public = require("koa-router")({ prefix: "/public" }); // 无身份校验
const private = require("koa-router")({ prefix: "/api" }); // 需登录
const controllers = require("./controllers");
const { defaultUpload } = require("./utils");

// 注册
public.post("/register", controllers.user.registerUser);
// 登录
public.post("/login", controllers.user.login);
// 用户信息
private.get("/user-info", controllers.user.userInfo);
// 更新用户信息
private.post("/update-user", controllers.user.updateUserInfo);
// 更新头像
private.post(
  "/update-avatar",
  defaultUpload.single("file"),
  controllers.user.uploadAvatar
);
// 修改密码
private.post("/change-pwd", controllers.user.changePwd);

module.exports = [public, private];
