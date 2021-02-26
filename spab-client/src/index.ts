import { MainController } from "./MainController";

// allow unsafe tls connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

new MainController();