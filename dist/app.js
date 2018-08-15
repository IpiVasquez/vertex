"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var path = require("path");
var bootstrap_1 = require("api/core/lib/bootstrap");
var config_1 = require("api/config");
var lib_1 = require("api/lib");
var models_1 = require("api/core/models");
var core_1 = require("api/core");
var logger = lib_1.masterLogger.getLogger('metapos', 'app');
var modules = [core_1.core];
var apiUri = '/api';
var Metapos = /** @class */ (function () {
    function Metapos(dbUri, port) {
        if (port === void 0) { port = 3000; }
        this.dbUri = dbUri;
        this.port = port;
        logger.verbose('Booting');
        // Creating express app
        this.app = express();
        this.config();
        this.initModules();
    }
    /**
     * Configures app: Adds port, body parser & static pages; connects to
     * databases, etc.
     */
    Metapos.prototype.config = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ngPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.app.set('port', this.port);
                        ngPath = path.resolve(process.cwd(), 'dist/public');
                        // Add a router for the api
                        this.addRouter();
                        // Angular will handle every other route requested
                        this.app.use(express.static(ngPath));
                        this.app.get('*', function (req, res) {
                            res.sendFile(path.join(ngPath, 'index.html'));
                            logger.silly("url: " + req.url);
                            logger.debug('Angular app served');
                        });
                        return [4 /*yield*/, config_1.mongoConnect(this.dbUri)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Configures the API router.
     */
    Metapos.prototype.addRouter = function () {
        logger.verbose('Setting api router at ' + apiUri);
        // Set API route as provided
        this.apiRouter = express_1.Router();
        this.app.use(apiUri, this.apiRouter);
        // Allows Angular app to use API while developing through CORS header
        var corsOptions;
        if (!this.isProduction) {
            corsOptions = { exposedHeaders: ['authorization'] };
        }
        else {
            logger.info('Production mode');
            // TODO: Only some origins
            corsOptions = { exposedHeaders: ['authorization'] };
        }
        logger.verbose('Adding CORS header setup');
        this.apiRouter.use(cors(corsOptions));
        // Set router to be able to handle json type and url encoded requests
        this.apiRouter.use(bodyParser.json());
        this.apiRouter.use(bodyParser.urlencoded({ extended: true }));
        // Error handler
        this.apiRouter.use(function (err, _, res, __) {
            logger.error('Not catched: ' + err.name, { error: err });
            res.json({
                message: err.message,
                name: err.name
            });
        });
        this.bootstrap();
    };
    Metapos.prototype.initModules = function () {
        var _this = this;
        modules.forEach(function (m) { return m.init(_this); });
    };
    Metapos.prototype.bootstrap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var teams, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, models_1.Team.find({})];
                    case 1:
                        teams = _a.sent();
                        if (!(!teams.length || process.env.BOOTSTRAP)) return [3 /*break*/, 3];
                        logger.info('Bootstraping');
                        return [4 /*yield*/, bootstrap_1.bootstrap()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        logger.info('Already bootstraped');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        logger.error('Failed while bootstraping: ' + e_1.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Metapos.prototype, "isProduction", {
        /**
         * Checks if this Server environment is set as production.
         * @returns true if this Server is in production, false otherwise.
         */
        get: function () {
            return process.env.NODE_ENV === 'production';
        },
        enumerable: true,
        configurable: true
    });
    return Metapos;
}());
exports.Metapos = Metapos;
