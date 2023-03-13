const { readFileSync, writeFileSync } = require('fs');
import { v4 as uuidv4 } from 'uuid';

import Router from 'koa-router';
import koaBody from 'koa-body';
// import { hello, helloSave } from './hello';
import { genMembers } from './fake';

const router = new Router();

// router.get('/api/hello', koaBody(), hello);
// router.get('/api/hello/save', koaBody(), helloSave);

router.get('/api/fake/genMembers', koaBody(), (ctx) => {
  ctx.body = {
    data: genMembers(),
  };
});

router.post('/api/simulator/save', koaBody(), async (ctx) => {
  const body = ctx.request.body;
  const path = './server/data/simulators.json';

  try {
    const { id } = body;
    const target = { ...body, id: id || uuidv4() };
    const data: any[] = JSON.parse(readFileSync(path)) || [];
    const index = data.findIndex((item) => item.id === target.id);

    if (index === -1) {
      data.push(target);
    } else {
      data.splice(index, 1, target);
    }

    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    ctx.body = {
      code: 0,
      message: '保存成功',
      data: target,
    };
  } catch (err) {
    console.info(err);
    ctx.body = {
      code: 50001,
      message: '服务器异常',
      err: err.message,
    };
  }
});

router.get('/api/simulator/list', async (ctx) => {
  const path = './server/data/simulators.json';

  try {
    const data: any[] = JSON.parse(readFileSync(path)) || [];

    ctx.body = {
      code: 0,
      message: '保存成功',
      data,
    };
  } catch (err) {
    console.info(err);
    ctx.body = {
      code: 50001,
      message: '服务器异常',
      err: err.message,
      data: [],
    };
  }
});

export default router;
