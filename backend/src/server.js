import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createStore } from './services/matching.js';
import { apiRouter } from './routes/api.js';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const store = createStore();

// Push group updates to its members and refresh the station's live pool.
function notify(group) {
  io.to(`group:${group.id}`).emit('group:update', store.groupView(group));
  io.to(`station:${group.stationId}`).emit('pool:update', store.stationPool(group.stationId));
}

io.on('connection', (socket) => {
  socket.on('watch:station', (id) => {
    for (const room of socket.rooms) if (room.startsWith('station:')) socket.leave(room);
    socket.join(`station:${id}`);
  });
  socket.on('watch:group', (id) => socket.join(`group:${id}`));
});

app.use('/api', apiRouter(store, notify));
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong' });
  if (!err.status) console.error(err);
});

setInterval(() => store.sweepExpired().forEach(notify), 5000);

server.listen(PORT, () => console.log(`Ridify API on http://localhost:${PORT}`));
