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
var logger = lib_2.masterLogger.getLogger('auth:login', 'controller');
/**
 * Logs user in.
 */
exports.login = new lib_2.Route('/login/:type', {
    post: { callback: postCb }
});
function postCb(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var data, type, loginStrategy, user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = req.body;
                    type = req.params.type;
                    if (type === 'local') {
                        loginStrategy = local;
                    }
                    else if (type === 'google') {
                        loginStrategy = google;
                    }
                    else {
                        loginStrategy = function () { return __awaiter(_this, void 0, void 0, function () {
                            var e;
                            return __generator(this, function (_a) {
                                e = new Error('Bad request');
                                e.name = 'Authorization error';
                                throw e;
                            });
                        }); };
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loginStrategy(data)];
                case 2:
                    user = _a.sent();
                    logger.debug('User found: ' + user.email);
                    res.json({ token: user.tokenize() });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    logger.warn(e_1.message);
                    if (e_1.name === 'Authorization error') {
                        res.status(401).json({
                            type: e_1.name,
                            message: e_1.message
                        });
                    }
                    else {
                        logger.error(e_1.message, { error: e_1 });
                        res.status(500).json({
                            type: e_1.name,
                            message: e_1.message
                        });
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Local login strategy (Traditional email & password).
 * @param data Object provides email & password.
 */
function local(data) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a, e, e;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger.debug('local => Searching for user');
                    return [4 /*yield*/, models_1.User.findOne({ email: data.email })];
                case 1:
                    user = _b.sent();
                    _a = user;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, user.checkPassword(data.password)];
                case 2:
                    _a = !(_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        e = new Error('Wrong password');
                        e.name = 'Authorization error';
                        throw e;
                    }
                    else if (!user) {
                        e = new Error('User not found');
                        e.name = 'Authorization error';
                        throw e;
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
/**
 * Google login strategy (OAuth2).
 * @param data Object provides Google token.
 */
function google(data) {
    return __awaiter(this, void 0, void 0, function () {
        var email, user, e;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug('google => Verifying token');
                    return [4 /*yield*/, lib_1.getGoogleUser(data.token)];
                case 1:
                    email = (_a.sent()).email;
                    return [4 /*yield*/, models_1.User.findOne({ email: email })];
                case 2:
                    if (!(user = _a.sent())) {
                        e = new Error();
                        e.name = 'Authorization error';
                        e.message = 'User not found';
                        throw e;
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
