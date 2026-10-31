import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(10) },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: String,
    upiId: String,
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
