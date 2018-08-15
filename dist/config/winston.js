"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
function winstonConfig(target) {
    if (target === void 0) { target = winston; }
    target.clear();
    target.addColors({
        error: 'red',
        warn: 'yellow',
        info: 'green',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'rainbow'
    });
}
exports.winstonConfig = winstonConfig;
