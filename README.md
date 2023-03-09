# WebComponents

https://blog.kalvad.com/export-your-angular-component-as-a-web-component/

## Create a new component
1. `ng g library <your-component-name>`
2. `./build.sh <your-component-name> [path/where/to/copy/your/lib]`
3. Include the file .js inside your application.

## Component development
<b>[optional] HotReload</b>
1. Copy `client.js` (inside `autoupdate` folder) inside your project and include it in your html as a module.
2. Start server with `node autoupdate/server.js`

<b>Build on change</b>

Watch for changes and re-build component with `./watch.sh <your-component-name> [path/where/to/copy/your/lib]`

<b> Enjoy :) </b>

## Troubleshooting
Usually working with node v14.18.3 and npm v6.14.15

| error| possible solution |
|---|---|
|./watch.sh: line 16: run-when-changed: command not found | `npm i -g run-when-changed` |