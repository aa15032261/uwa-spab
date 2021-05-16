# spab-server
This is the server side of the application handling database manipulation, WebSocket and REST APIs. 

The app is written in TypeScript and targeted to run with NodeJS v14 and above, and PostgresSQL database 9.3 and above.


## Usage
To run the app, you need to install all necessary dependencies by running the following command line:
```
npm install
```
Then, run this command to start the app:
```
node ./dist/index.js
```
The server app depends on **spab-gui** and **spab-data-struct** sub-projects. Please ensure the server side maintains the following directory structure:  
```
├── spab-server  
│   ├── dist  
│   │   └── ...  
│   ├── static  
│   │   └── ...  
│   ├── private  
│   │   └── ...  
│   ├── config.js  
│   └── ...  
├── spab-gui  
│   └── dist  
│       └── ...  
└── spab-data-struct  
    ├── SpabDataStruct.d.ts  
    ├── SpabDataStruct.js  
    └── ...  
```

## Admin Script
The server app comes with an admin script for managing the database. To use the admin script, run the following command:
Then, run this command to start the app:
```
node ./dist/Admin.js
```

The script contains these options:
```
3871: Rebuild database
1: List users
2: Create a new user
3: Remove a user
4: List clients
5: Create a new client
6: Remove a client
7: Remove client's logs
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


## Files and Directories
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

