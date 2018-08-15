"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file represents /bin/www
// To get typescript paths able to work
var dotenv = require("dotenv");
// Config environment before anything on API server starts
dotenv.config();
// If isn't TypeScript instance change paths to their aliases
if (!process.env.TS) {
    /**
     * TODO: Document why and how module-alias works along with tsconfig-paths...
     */
    require('module-alias/register');
}
var http = require("http");
var lib_1 = require("api/lib");
var app_1 = require("api/app");
var logger = lib_1.masterLogger.getLogger('server', 'server');
process.on('uncaughtException', function (err) {
    return logger.error('Uncaught exception', { error: err });
});
process.on('unhandledRejection', function (err) {
    return logger.error('Unhandled rejection', { error: err });
});
// Need to be provided at .env
var port = Number(process.env.PORT);
var mongoUri = process.env.MONGODB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.MONGOLAB_URI;
logger.verbose('Creating app');
var metapos = new app_1.Metapos(mongoUri, port);
var server = http.createServer(metapos.app);
server.listen(port);
logger.info('Server listening on port ' + port);
