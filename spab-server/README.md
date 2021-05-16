# spab-server
This is the server side of the application handling database manipulation, WebSocket and REST APIs. 

The app is written in TypeScript and targeted to run with NodeJS v14 and above.


## Usage
To run the app, we need to install all necessary dependencies by running the following command line:
```
npm install
```
Then, run this command to start the app:
```
node ./dist/index.js
```

## Compiling the app
If you need to compile the app, you will need to install the **nodemon** and **tsc** packages globally:
```
npm install nodemon tsc -g
```
Then, run this command to monitor and compile the source code. This command will automatically recompile the app if the source code has changed.
```
npm run dev
```


## Directories
The server app contains the following files and directories:

| Name | Description |
| - | - |
| dist          | Precompiled app |
| src           | Server app source code |
| static        | Static resource that is accessible publicly |
| private       | Restricted resource that is managed by the app |
| server_config | Contains configuration files required to setup the environment correctly |
| php           | Contains a php script to check and control the status of the app |
| spab_run.sh   | The cron job script for restarting the app |
| config.js     | Server app configuration file, see ./src/Config.ts for details |

