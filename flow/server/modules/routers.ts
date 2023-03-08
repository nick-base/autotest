import Router from 'koa-router';
import koaBody from 'koa-body';
import { hello, helloSave } from './hello';
import { genMembers } from './fake';

const router = new Router();

router.get('/api/hello', koaBody(), hello);
router.get('/api/hello/save', koaBody(), helloSave);

router.get('/api/fake/genMembers', koaBody(), (ctx) => {
  ctx.body = {
    data: genMembers(),
  };
});

export default router;
