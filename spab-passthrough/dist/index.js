"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainController_1 = require("./MainController");
// allow unsafe tls connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
new MainController_1.MainController();
