# WebComponents

https://blog.kalvad.com/export-your-angular-component-as-a-web-component/

## Create a new component
1. `ng g library <your-component-name>`
2. `./build.sh <your-component_name> [path_where_to_copy_your_lib]`
3. Include the file .js inside your application.

## Troubleshooting
| error| possible solution |
|---|---|
|./watch.sh: line 16: run-when-changed: command not found | `npm i -g run-when-changed` |