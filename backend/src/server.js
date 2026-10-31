import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import * as store from './services/matching.js';
import { apiRouter } from './routes/api.js';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Push group updates to its members and refresh the station's live pool.
async function notify(groupView) {
  io.to(`group:${groupView.id}`).emit('group:update', groupView);
  io.to(`station:${groupView.stationId}`).emit('pool:update', await store.stationPool(groupView.stationId));
}

io.on('connection', (socket) => {
  socket.on('watch:station', (id) => {
    for (const room of socket.rooms) if (room.startsWith('station:')) socket.leave(room);
    socket.join(`station:${id}`);
  });
  socket.on('watch:group', (id) => socket.join(`group:${id}`));
});

app.use('/api', apiRouter(notify));
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong' });
  if (!err.status) console.error(err);
});

setInterval(() => {
  store.sweepExpired().then((changed) => changed.forEach(async (g) => notify(await store.groupView(g))));
}, 5000);

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Ridify API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Set MONGODB_URI, or run a local Mongo on 127.0.0.1:27017.');
    process.exit(1);
  });
