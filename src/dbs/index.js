

const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const config = require('../../config');

// 导入所有models
exports.initModels = () => {
  glob.sync(path.resolve(__dirname, './models', '**/*.js')).forEach(require);
};

// 初始化一个管理员
exports.initAdmin = async () => {
  const User = mongoose.model('User');
  const admin = await User.findOne({
    account: 'jallen',
  });
  if (!admin) {
    const superman = new User({
      account: 'jallen',
      password: '123456',
      nickname: '一只小咩咩',
      introduce: '要像小太阳一个开心呀',
      job: '前端开发工程师',
      mail: '869235582@qq.com',
      company: '欣动科技',
      address: '中国🇨🇳- 无锡',
      userType: 1,
    })
    await superman.save();
  }
};

// 数据库连接
exports.dbConnect = () => {
  let maxConnectCount = 0;
  const mongooseOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  return new Promise((resolve, reject) => {
    mongoose.connect(config.db, mongooseOptions);
    mongoose.connection.on('error', err => {
      maxConnectTimes++;
      if (maxConnectTimes < 5) {
        mongoose.connect(config.db, mongooseOptions);
      } else {
        console.log('数据库连接失败!', err);
      }
    });
    mongoose.connection.once('open', () => {
      resolve();
      console.log('数据库连接成功!');
    });
  });
}
