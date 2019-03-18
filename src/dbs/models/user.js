
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { updateMeta } = require('../utils');
const config = require('../../../config');

const userSchema = new mongoose.Schema({
  // 账号
  account: {
    type: String,
    unique: true,
  },
  // 密码
  password: String,
  // 头像
  avatar: {
    type: String,
    default: 'default-avatar.jpg',
  },
  // 昵称
  nickname: String,
  // 个人简介
  introduce: String,
  // 职业
  job: String,
  // 邮箱
  mail: String,
  // 公司
  company: String,
  // 地址
  address: {
    type: String,
    default: '中国🇨🇳',
  },
  // 标签
  userTag: {
    type: Array,
    default: ["乐观开朗", "机灵鬼", "肥宅🐷~"],
  },
  // 用户权限 0: 普通用户, 1: 管理员
  userType: { type: Number, default: 0, },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
  }
});

// 更新日期
userSchema.pre('save', updateMeta);

// 设置默认nickname = account
userSchema.pre('save', function(next) {
  if (this.isNew && !this.nickname) {
    this.nickname = this.account;
  }
  next();
});

// 密码加密
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  bcrypt.genSalt(config.saltRounds, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error);
      this.password = hash;
      next();
    });
  });
});

// 对比密码
userSchema.methods.comparePassword = function (password, dbPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, dbPassword, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

mongoose.model('User', userSchema);
