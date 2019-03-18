

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const path = require('path');
const koaStatic = require('koa-static');
const config = require('./config');
const { initModels, initAdmin, dbConnect } = require('./src/dbs');
const responseMiddleware = require('./src/middlewares/response');
const validateToken = require('./src/middlewares/validateToken');
const routers = require('./src/routers');

;(async () => {
  // 连接数据
  await dbConnect();
  try {
    // 初始化models
    initModels();
    // 新建管理员
    await initAdmin();
    // koa
    const app = new Koa();
    app.use(koaStatic(path.join(__dirname, './static')));
    app.use(bodyParser());
    app.use(responseMiddleware);
    app.use(koaJwt({ secret: config.jwtSecret }).unless({
      path: [/^((?!\/api))/],
    }));
    // 验证token是否合法
    app.use(validateToken);
    routers.forEach(r => {
      app.use(r.routes());
    });
    app.listen('3000', () => {
      console.log('***************************');
      console.log('app listening on port 3000');
      console.log('***************************');
    });
  } catch (err) {
    console.log(err);
  }
})();
