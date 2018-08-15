"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var lib_1 = require("api/lib");
var logger = lib_1.masterLogger.getLogger('core:requester', 'lib');
function requester(url) {
    return new Promise(function (resolve, reject) {
        https
            .get(url, function (resp) {
            var body = '';
            var chunks = 0;
            resp.on('data', function (chunk) {
                body += chunk;
                chunks++;
            });
            resp.on('end', function () {
                logger.silly('Total chunks: ' + chunks);
                var data = JSON.parse(body);
                resolve(data);
            });
            resp.on('error', function (err) { return reject(err); });
        })
            .on('error', function (err) {
            logger.error(err.message);
            reject(err);
        });
    });
}
exports.requester = requester;
