const io = require('socket.io-client');
const configs = require('./configs');

const message = process.argv[2];

const socket = io(`ws://localhost:${configs.port}`);

const log = (msg) => console.log('notify.js: ' + msg);

socket.on('connect', () => {
  socket.emit('notify', {
    caller: 'notify.js',
    timestamp: Date.now(),
    message
  });
});

socket.on('notify-response', (data) => {
  socket.removeAllListeners();
  socket.disconnect();
  log('done');
});