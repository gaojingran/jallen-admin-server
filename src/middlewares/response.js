

module.exports = async function(ctx, next) {
  try {
    await next();
    if (ctx.body || ctx.state.data) {
      ctx.body = ctx.body ? ctx.body : {
        code: ctx.state.code !== undefined ? ctx.state.code : 0,
        data: ctx.state.data !== undefined ? ctx.state.data : {},
        serverTime: +new Date(),
      };
    } else {
      ctx.throw(404);
    }
  } catch (e) {
    const status = e && e.status ? e.status : 200;
    const error = e && e.message ? e.message : e.toString();
    console.log('response catch error:', ctx.url + ' ' +error);
    ctx.status = status;
    ctx.body = {
      code: -1,
      serverTime: +new Date(),
      error: status === 401 ? '用户信息验证失效,请重新登录!' : error,
    };
  };
}
