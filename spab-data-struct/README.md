# spab-data-struct
This directory contains the data structure used in data transmission between the server, gui and client. 

## Protocol Buffer
Protocol Buffer is used for data transmission in the application because 
it can reduce the bandwidth as it converts json object to binary data. Therefore, it is ideal for this application.  

However, the sensor data is still in json format as we don't have enough time to integrate Protocol Buffer to the whole application.
  
Learn more about Protocol Buffer here:  
https://protobufjs.github.io/protobuf.js/  
https://github.com/protobufjs/protobuf.js  

## Convert Protocol Buffer definition to TypeScript
Firstly, you need to install protobufjs globally:
```
npm install protobufjs -g
```

Then, run either of the following commands to convert Protocol Buffer definition to TypeScript:
```
pbjs -t json-module -w commonjs -o SpabDataStruct.js SpabDataStruct.proto
pbjs -t static-module SpabDataStruct.proto | pbts -o SpabDataStruct.d.ts -
```
or
```
npm run build
```

## Files
| Name | Description |
| - | - |
| SpabDataStruct.proto  | Data structure definition |
| SpabDataStruct.d.ts   | Precompiled TypeScript definition |
| SpabDataStruct.js     | Precompiled JavaScript code of the data structure |
