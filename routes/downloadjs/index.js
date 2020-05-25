const router = require('koa-router')();
const koaSend = require('koa-send');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver')

router.get('/api/download/get', async (ctx, next) => {
  const filePath = '/public/images/1.JPG';
  ctx.attachment(filePath)
  await koaSend(ctx, filePath);
});

router.post('/api/download/post', async (ctx, next) => {
  const formData = ctx.request.body;
  const { id } = formData;
  const zipName = 'post_download.zip';
  const zipStreame = fs.createWriteStream(zipName);
  const zip = archiver('zip');
  zip.pipe(zipStreame);
  if (Array.isArray(id) && id.length) {
    id.forEach(item => {
      zip.append(fs.ReadStream(path.join(__dirname, `../../public/images/${item}.JPG`)), {
        name: `${item}.JPG`
      });
    })
  } else {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      msg: '参数错误',
    };
  }
  ctx.attachment(zipName)
  await koaSend(ctx, zipName);
});

module.exports = router;
