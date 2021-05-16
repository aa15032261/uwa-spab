# spab-passthrough
This is the user application handling mavlink data passthrough. User's ground station software can connect to the app's local tcp socket to communicate with the client.

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


## Files and directories
The server app contains the following files and directories:

| Name | Description |
| - | - |
| dist          | Precompiled app |
| src           | Server app source code |
| config.js     | Server app configuration file, see ./src/Config.ts for details |

