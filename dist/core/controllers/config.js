"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("api/lib");
/**
 * Sends configurations shared across server and client.
 */
exports.config = new lib_1.Route('/config', {
    get: {
        callback: function (_, res) {
            var conf = {};
            res.json(conf);
        }
    }
});
