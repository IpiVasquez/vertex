"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as dotenv from 'dotenv';
// dotenv.config();
var winston = require("winston");
var colors = require("colors");
var wConfig = require("api/config/winston");
var _a = winston.format, combine = _a.combine, timestamp = _a.timestamp, printf = _a.printf, colorize = _a.colorize;
wConfig.winstonConfig();
var Logger = /** @class */ (function () {
    function Logger(options) {
        if (options === void 0) { options = { name: 'untagged', color: 'blue' }; }
        var _this = this;
        this.info = function (message, meta) { return _this.logger.info(message, meta); };
        this.error = function (message, meta) { return _this.logger.error(message, meta); };
        this.debug = function (message, meta) { return _this.logger.debug(message, meta); };
        this.silly = function (message, meta) { return _this.logger.silly(message, meta); };
        this.warn = function (message, meta) { return _this.logger.warn(message, meta); };
        this.verbose = function (message, meta) { return _this.logger.verbose(message, meta); };
        this.addColor = getColorizer(options.color);
        this.name = options.name;
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            transports: options.transports || [
                new winston.transports.Console({
                    handleExceptions: true,
                    format: combine(colorize({ level: true }), timestamp(), printf(this.consoleFormat.bind(this)))
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error'
                })
            ]
        });
    }
    Logger.prototype.getLogger = function (source, type) {
        var _this = this;
        var obj = { label: type, source: source || this.name };
        return {
            info: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.info(message, Object.assign({}, obj, meta));
            },
            error: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.error(message, Object.assign({}, obj, meta));
            },
            warn: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.warn(message, Object.assign({}, obj, meta));
            },
            verbose: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.verbose(message, Object.assign({}, obj, meta));
            },
            debug: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.debug(message, Object.assign({}, obj, meta));
            },
            silly: function (message, meta) {
                if (meta === void 0) { meta = {}; }
                return _this.logger.silly(message, Object.assign({}, obj, meta));
            }
        };
    };
    Logger.prototype.consoleFormat = function (info) {
        var addColor = getColorizer(info.label) || this.addColor;
        var out = colors.reset("" + info.level + colors.reset('\t  '));
        var tab = (info.source || this.name).length > 11 ? '\t' : '\t\t';
        out += colors.bold(addColor("[" + (info.source || this.name) + "]" + tab));
        out += colors.italic(info.message);
        out += colors.reset(' ');
        return out;
    };
    return Logger;
}());
exports.Logger = Logger;
exports.masterLogger = new Logger();
function getColorizer(type) {
    switch (type) {
        case 'red':
        case 'module':
            return colors.red;
        case 'blue':
        case 'model':
            return colors.blue;
        case 'yellow':
            return colors.yellow;
        case 'green':
        case 'controller':
            return colors.green;
        case 'cyan':
        case 'config':
        case 'middleware':
            return colors.cyan;
        case 'purple':
        case 'lib':
        case 'magenta':
            return colors.magenta;
        case 'black':
        case 'white':
        case 'server':
            return colors.bgRed;
        case 'app':
            return colors.bgGreen;
        default:
            return colors.rainbow;
    }
}
