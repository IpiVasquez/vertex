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
var lib_1 = require("api/auth/lib");
var models_1 = require("api/auth/models");
var lib_2 = require("api/lib");
var logger = lib_2.masterLogger.getLogger('auth:register', 'controller');
/**
 * Registers a new User.
 */
exports.register = new lib_2.Route('/register/:type', {
    post: { callback: post }
});
function post(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var data, type, registerStrategy, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = req.body;
                    type = req.params.type;
                    if (type === 'local') {
                        registerStrategy = local;
                    }
                    else if (type === 'google') {
                        registerStrategy = google;
                    }
                    else {
                        registerStrategy = function () { return __awaiter(_this, void 0, void 0, function () {
                            var e;
                            return __generator(this, function (_a) {
                                e = new Error('Bad request');
                                e.name = 'Registration error';
                                throw e;
                            });
                        }); };
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, registerStrategy(data)];
                case 2:
                    _a.sent();
                    res.status(201).json({ message: 'OK' });
                    logger.debug('User registered');
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    logger.warn(e_1.message, { error: e_1 });
                    if (/.*1 dup key.*/.test(e_1.message)) {
                        // Dup key
                        res.status(400).json({
                            type: 'Registration error',
                            message: 'User already registered'
                        });
                    }
                    else if (e_1.name === 'ValidationError') {
                        // Inconsistent
                        res.status(400).json({
                            type: 'Registration error',
                            message: 'Inconsistent data'
                        });
                    }
                    else {
                        res.status(500).json({
                            // What?
                            type: e_1.name,
                            message: 'What?'
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Local register strategy (Traditional email & password).
 * @param data Object provides email, password & name.
 */
function local(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug('Trying to register ' + data.email);
                    return [4 /*yield*/, models_1.User.create({
                            email: data.email,
                            profile: { name: data.name },
                            password: data.password
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Google register strategy (OAuth2).
 * @param data Object provides Google token.
 */
function google(data) {
    return __awaiter(this, void 0, void 0, function () {
        var u;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lib_1.getGoogleUser(data.token)];
                case 1:
                    u = _a.sent();
                    logger.debug('Trying to register ' + u.email);
                    return [4 /*yield*/, models_1.User.create({
                            email: u.email,
                            profile: {
                                name: u.name,
                                lastName: u.lastName,
                                image: u.image
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
