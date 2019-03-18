

const types = require('./types');

const registerSchema = {
  account: types.account,
  password: types.password,
};

const userInfoSchema = {
  nickname: types.nickname,
  introduce: types.introduce,
  mail: types.mail,
  company: types.company,
  job: types.job,
  address: types.address,
  userTag: types.userTag,
};

module.exports = {
  registerSchema,
  userInfoSchema,
};
