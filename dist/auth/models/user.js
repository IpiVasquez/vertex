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
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs"); // TODO: Ensure this encryption really works
var lib_1 = require("api/lib");
var logger = lib_1.masterLogger.getLogger('auth:user', 'model');
var secret = process.env.SECRET;
var SALT_WORK_FACTOR = 10;
var defaultExpiry = 24 * 3600; // 24hrs
var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    profile: {
        name: { type: String, required: true },
        lastName: { type: String, default: '' },
        image: { type: String, default: '' },
        teamId: { type: Number }
    },
    settings: {
        expiry: { type: Number, default: defaultExpiry },
        locale: { type: String, default: 'es' }
    },
    password: { type: String } // TODO: What happens?
}, { timestamps: true }).pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, hash, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!this.isModified('password')) {
                        return [2 /*return*/, next()];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    logger.debug('Generating salt');
                    return [4 /*yield*/, bcrypt.genSalt(SALT_WORK_FACTOR)];
                case 2:
                    salt = _a.sent();
                    logger.debug('Generating hash');
                    return [4 /*yield*/, bcrypt.hash(this.password, salt)];
                case 3:
                    hash = _a.sent();
                    logger.debug('Saving password');
                    // @ts-ignore
                    this.password = hash;
                    next();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    logger.error(e_1.message, { error: e_1 });
                    next(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * Checks the password provided matches the user password.
 */
userSchema.methods.checkPassword = function (password) {
    return __awaiter(this, void 0, void 0, function () {
        var match, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug('Comparing password');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, bcrypt.compare(password, this.password)];
                case 2:
                    match = _a.sent();
                    return [2 /*return*/, match];
                case 3:
                    e_2 = _a.sent();
                    logger.error(e_2.message, { error: e_2 });
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
};
/**
 * Transforms this user into a jwt.
 */
userSchema.methods.tokenize = function () {
    var token = jwt.sign({
        // iss: 'MetaPOS', // The issuer of the token
        sub: this._id,
        email: this.email,
        profile: this.profile,
        settings: this.settings
    }, secret, {
        expiresIn: this.settings.expiry
    });
    logger.debug(this.email + ' tokenized');
    return token;
};
/**
 * Verifies the token provided, then retrieves user from the it.
 * @param token Token generated by user.tokenize.
 */
userSchema.statics.detokenize = function (token) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug('Detokenizing');
                    user = jwt.verify(token, secret);
                    logger.debug('Searching');
                    return [4 /*yield*/, this.findById(user.sub)];
                case 1: 
                // @ts-ignore
                return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.User = mongoose.model('users', userSchema);
