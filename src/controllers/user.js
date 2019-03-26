const Joi = require("joi");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const userValidate = require("../validate/user");

/**
 * 注册账号
 * @param account 4到16位
 * @param password 6到16位
 * */
async function registerUser(ctx, next) {
  const User = mongoose.model("User");
  const { body } = ctx.request;
  const { error, value } = Joi.validate(body, userValidate.registerSchema);
  if (error) {
    throw new Error(error.message);
  } else {
    const user = await User.findOne({ account: value.account.toLowerCase() });
    if (user) {
      throw new Error("账户已存在!");
    } else {
      const newAccount = new User(value);
      await newAccount.save();
      ctx.state.data = {
        result: true
      };
    }
  }
}

/**
 * 登录
 * @param account
 * @param password
 * */
async function login(ctx, next) {
  const User = mongoose.model("User");
  const { body } = ctx.request;
  const user = await User.findOne({ account: body.account.toLowerCase() });
  if (user) {
    const match = await user.comparePassword(body.password, user.password);
    if (!match) {
      throw new Error("用户名或密码错误!");
    } else {
      ctx.state.data = {
        token: jwt.sign({ data: user._id }, config.jwtSecret, {
          expiresIn: config.tokenExpiresTime
        })
      };
    }
  } else {
    throw new Error("用户名或密码错误!");
  }
}

/**
 * 用户信息
 */
async function userInfo(ctx, next) {
  const { state } = ctx;
  const id = state.user.data;
  const User = mongoose.model("User");
  const user = await User.findById(id, { password: 0 });
  ctx.state.data = user;
}

/**
 * 更新个人信息
 * @param nickname
 * @param introduce
 * @param mail
 * @param job
 * @param company
 * @param address
 * @param userTag
 * */
async function updateUserInfo(ctx, next) {
  const { state } = ctx;
  const { body } = ctx.request;
  const id = state.user.data;
  const User = mongoose.model("User");
  const { error, value } = Joi.validate(body, userValidate.userInfoSchema);
  if (error) {
    throw new Error(error.message);
  } else {
    const data = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    ctx.state.data = _.omit(data, ["password"]);
  }
}

/**
 * 更新用户头像
 */
async function uploadAvatar(ctx, next) {
  const { state } = ctx;
  const { body } = ctx.request;
  const id = state.user.data;
  // 返回的文件名
  const filename = ctx.req.file.filename;
  const User = mongoose.model("User");
  const data = await User.findByIdAndUpdate(id, { $set: { avatar: filename } });
  // 删除旧图片
  if (data.avatar !== "default-avatar.jpg") {
    fs.unlinkSync(path.resolve(__dirname, `../../static/image/${data.avatar}`));
  }
  ctx.state.data = filename;
}

/**
 * 修改密码
 * @param password
 * @param newPassword
 */
async function changePwd(ctx, next) {
  const { body } = ctx.request;
  const id = ctx.state.user.data;
  const User = mongoose.model("User");
  const user = await User.findById(id);
  const match = await user.comparePassword(body.password, user.password);
  if (match) {
    user.password = body.newPassword;
    await user.save();
    ctx.state.data = { result: true };
  } else {
    throw new Error("原始密码错误!");
  }
}

module.exports = {
  registerUser,
  login,
  userInfo,
  updateUserInfo,
  uploadAvatar,
  changePwd
};
