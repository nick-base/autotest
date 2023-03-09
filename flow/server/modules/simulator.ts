import { Simulator, Operation } from '../../shared/interface';

export const execute = async (ctx, { browser, page }) => {
  const data = ctx.request.body as Simulator;
  const { steps = [] } = data;
  const frame = await page.frames().find((frame) => frame.name() === 'iframe-1');

  steps.forEach(async (item) => {
    const { type, url } = item;
    if (type === Operation.GOTO) {
      await frame.goto(url);
    }
  });

  ctx.body = {
    code: '0',
  };
};
