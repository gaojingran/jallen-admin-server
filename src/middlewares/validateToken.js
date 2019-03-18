
const mongoose = require('mongoose');

module.exports = async function(ctx, next) {
  if (ctx.url.match(/^\/api/)) {
    // 验证token是否合法
    const User = mongoose.model('User');
    const id = ctx.state.user.data;
    const user = await User.findById(id);
    if (user) {
      return next();
    } else {
      ctx.throw(401);
    }
  } else {
    return next();
  }
}
