import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const memberSchema = new mongoose.Schema(
  {
    userId: String,
    zoneId: String,
    joinedAt: Date,
    paid: { type: Boolean, default: false },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    id: String,
    userId: String,
    name: String,
    text: String,
    at: Date,
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(8) },
    stationId: { type: String, required: true },
    meetingPoint: String,
    womenOnly: { type: Boolean, default: false },
    status: { type: String, default: 'open' }, // open | full | departed | cancelled | expired
    expiresAt: Date,
    members: [memberSchema],
    messages: [messageSchema],
  },
  { timestamps: true },
);

export default mongoose.model('Group', groupSchema);
