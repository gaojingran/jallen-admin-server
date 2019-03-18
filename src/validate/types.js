const Joi = require("joi");

module.exports = {
  account: Joi.string()
    .required()
    .min(4)
    .max(16)
    .error(new Error("账号长度为4到16位")),
  password: Joi.string()
    .required()
    .min(6)
    .max(16)
    .error(new Error("密码长度为6到16位")),
  nickname: Joi.string()
    .required()
    .max(16)
    .error(new Error("最大长度不超过16位字符")),
  introduce: Joi.string()
    .max(256)
    .error(new Error("最大长度不超过256位字符")),
  mail: Joi.string()
    .regex(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    .error(new Error("邮箱格式不合法")),
  company: Joi.string()
    .max(32)
    .error(new Error("最大长度不超过32位字符")),
  job: Joi.string()
    .max(16)
    .error(new Error("最大长度不超过16位字符")),
  address: Joi.string()
    .max(32)
    .error(new Error("最大长度不超过32位字符")),
  userTag: Joi.array()
    .max(16)
    .items(Joi.string().max(8))
    .error(new Error("最大可添加16个标签且单个标签最大长度不超过8位字符"))
};
