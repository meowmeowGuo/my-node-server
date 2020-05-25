const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const downloadJSRoute = require('./routes/downloadjs/index');

// error handler
onerror(app)

/* // middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
})) */
// 数据解析
app.use(
  koaBody({
    multipart: true,
    json: true,
    jsonLimit: '5mb',
    formLimit: '20mb',
    textLimit: '50mb',
    // 不使用自动上传配置，需要对文件做校验等处理
    formidable: {
      maxFieldsSize: 50 * 1024 * 1024, // 限制字段大小，默认值（2M）太小不够用
    },
  })
);
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(downloadJSRoute.routes(),index.allowedMethods());
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(3001);

module.exports = app
