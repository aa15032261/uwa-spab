# spab-client
This is the client side of the application handling mavlink connection, camera streams, sensors and offline caching.

The app is written in TypeScript and targeted to run with NodeJS v14 and above, and the FFMpeg executable.


## Usage
To run the app, you need to install all necessary dependencies by running the following command line:
```
npm install
```

The client app requires **spab-data-struct** sub-project to run and compile. Please ensure the client side maintains the following directory structure:
```
├── spab-client  
│   ├── dist  
│   │   └── ...  
│   ├── config.js  
│   └── ...  
└── spab-data-struct  
    ├── SpabDataStruct.d.ts  
    ├── SpabDataStruct.js  
    └── ...  
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

If you need to update the Mavlink definition library (the app comes with pre-generated ArduPilotMega v1.0 definition), you can follow the official guide:  
http://mavlink.io/en/getting_started/generate_libraries.html  
https://github.com/ArduPilot/pymavlink  

The pre-generated library is generated with **pymavlink** Pyhton package with the following command:
```
python3 -m pymavlink.tools.mavgen --lang=TypeScript --wire-protocol=2.0 {{path of the pymavlink package}}/message_definitions/v1.0/ardupilotmega.xml -o {{path of output directory}}
```

Finally, run this command to monitor and compile the source code. This command will automatically recompile the app if the source code has changed.
```
npm run dev
```


## Files and directories
The server app contains the following files and directories:

| Name | Description |
| - | - |
| dist          | Precompiled app |
| src           | Client app source code |
| config.js     | Client app configuration file, see ./src/Config.ts for details |

