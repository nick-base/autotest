import mongoose from 'mongoose';

const StatisticsSchema = new mongoose.Schema(
  {
    date: String,
    counter: Number,
  },
  {
    strict: false,
  }
);

export default mongoose.model('Statistics', StatisticsSchema);
