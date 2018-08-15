"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines a Metapos Module. It receives an initializer function which
 * the Metapos app will execute.
 */
var MetaposModule = /** @class */ (function () {
    function MetaposModule(init) {
        this.init = init;
    }
    return MetaposModule;
}());
exports.MetaposModule = MetaposModule;
