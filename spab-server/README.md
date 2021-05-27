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
The server app requires **spab-gui** and **spab-data-struct** sub-projects to run and compile. Please ensure the server side maintains the following directory structure:  
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

Since it is impossible to setup a start-up task on the Bluehost server, a cron job is created to start the software automatically when it is stopped. Please keep in mind that each cron job is running in a container so there is no way to stop a cron job. However, the provided PHP script can be used as a workaround.

## PHP Script for starting and stopping the software remotely
There is a PHP script named **spab_run.php** in the php directory for starting and stopping the server software remotely. It is not recommanded to use it in production environment but it is convenient for debugging. It supports these APIs:
 
List all running process on the server:
```
./php/spab_run.php?type=list
```

Kill all nodejs process:
```
./php/spab_run.php?type=killnode
```

Restart the server software:
```
./php/spab_run.php?type=restart
```

Stop the server software:
```
./php/spab_run.php?type=stop
```
We have found that the PHP process on Bluehost is running as root, so we wrote a PHP script to control Nodejs processes.


## Admin Script
The server app comes with an admin script for managing the database. To use the admin script, run the following command:
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


## Files and directories
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

