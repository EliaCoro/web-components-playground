/**
 * Copy this file to your project.
 * This script will listen for changes in the library and will trigger a reload.
 * 
 * You can set a callback to be executed when the library is updated with
 * window.onHotReload = (callback, data) => { ... }
 * 
 * You can also set a library name to listen for changes with
 * window.hotReloadLibraryName = 'my-library';
 * if this is not set, the callback will be called for any library change. Otherwise it will listen only for that specific library.
 */

// const io = require('socket.io-client');

// Using this instead of the above line will allow you to use this script in the browser
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const configs = {
  port: 9909
}

const socket = io(`ws://localhost:${configs.port}`);

const log = (msg) => console.log('client.js: ' + msg);

socket.on('connect', () => {
  socket.on('notify', (data) => {
    // data => {"caller":"notify.js","timestamp":1678349167411, "message": "my-library"}

    log(`notify: ${JSON.stringify(data)}`);

    if (typeof window.hotReloadLibraryName === 'string' && window.hotReloadLibraryName !== data.message) {
      log(`ignoring update for library ${data.message}`);
      return;
    }

    const defaultCallback = () => window.location.reload();

    if (typeof window.onHotReload === 'function') {
      window.onHotReload(defaultCallback, data);
    } else defaultCallback();
  })
});