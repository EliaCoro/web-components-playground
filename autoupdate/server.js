const Server = require('socket.io').Server;
const configs = require('./configs');

const port = configs.port;

const io = new Server(port, {
  origin: '*:*',
  allowedHeaders: '*',
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
  }
});

let connected = 0;

const log = (msg) => console.log('server.js: ' + msg);

io.on('connection', (socket) => {
  connected++;
  log(`user connected (${connected})`);

  socket.on('notify', (data) => {
    log(`notify: ${JSON.stringify(data)}`);
    socket.broadcast.emit('notify', data);
    socket.emit('notify-response', {});
  });

  socket.on('disconnect', () => {
    connected--;
    log(`user disconnected (${connected})`);
  });
});


log(`Server running on port ${port}`);