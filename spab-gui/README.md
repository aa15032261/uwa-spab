# spab-gui
This directory contains the GUI of the application. 

## Angular
The GUI is built with Angular. To setup the environment, you need to install Angular package globally with npm:
```
npm install -g @angular/cli
```
  
Then, install app dependencies:
```
npm install
```
  
To build the app, run:
```
ng build --prod
```

Learn more about Angular here:  
https://angular.io/guide/setup-local


## Directories and files
| Name | Description |
| - | - |
| ./dist                    | Precompiled GUI |
| ./src/page/main           | Contains the code for the main page |
| ./src/page/sidebar        | Contains the code for the sidebar |
| ./service/api.service.ts  | Contains the code for server communication |
| ./service/api.service.ts  | Contains utility functions used in the app such as resize detection |
