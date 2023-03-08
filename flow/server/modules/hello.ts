import redis from '../lib/redis';
import dbConnect from '../lib/dbConnect';
import Statistics from '../models/Statistics';

export const hello = async (ctx) => {
  ctx.body = {
    env: process.env.NODE_ENV,
  };
};

export const helloSave = async (ctx) => {
  const date = new Date().toLocaleDateString();
  const key = `api-helllo-${date}`;

  const counter = await redis.incrby(key, 1);
  if (counter === 1) {
    await redis.pexpire(key, 24 * 60 * 60 * 1000);
  }

  await dbConnect();
  const statistics = await Statistics.findOneAndUpdate(
    { date },
    { date, $inc: { counter: 1 }, key },
    { upsert: true, new: true, lean: true }
  );

  ctx.body = {
    key,
    env: process.env.NODE_ENV,
    counter,
    statistics,
  };
};
