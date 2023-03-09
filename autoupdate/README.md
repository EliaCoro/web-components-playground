# Readme.md

1. Start server with `node server.js`
2. Copy `client.js` inside your project html and configure it
3. Notify changes when there are any with `node notify.js [optional_message]`

When you call `notify.js`, server will broadcast that messsage to all clients.

## Configuring `client.js`
You can set `window.hotReloadLibraryName = "<your-lib-name>"` to avoid reload on any event trigger.


You can set `window.onHotReload = (cbk, data) => { ... }` to customize the action when a event is emitted. `cbk()` will reload the page. `data` is structured like this:
```js
// data param passed to window.onHotReload
{
  message: "<library-name>",
  timestamp: "<moment-of-emitted-event>",
  caller: "<name-of-file-who-emitted-event>"
}
```