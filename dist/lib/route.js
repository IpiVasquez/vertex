"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("api/lib");
var logger = lib_1.masterLogger.getLogger('routes', 'lib');
/**
 * Defines routes behavior.
 */
var Route = /** @class */ (function () {
    /**
     * @param route Indicates which URL this controls.
     * @param constrollers Defines how each method in this route will behave and
     * which middleware will use.
     */
    function Route(route, controllers) {
        this.route = route;
        this.controllers = controllers;
    }
    Object.defineProperty(Route.prototype, "router", {
        /**
         * Sets this route in the router given.
         * @param router Where to set this route.
         */
        set: function (router) {
            // Goes through each method provided in controllers
            for (var _i = 0, _a = Object.keys(this.controllers); _i < _a.length; _i++) {
                var method = _a[_i];
                logger.info("Adding " + method + " method to " + this.route);
                var controller = this.controllers[method];
                // Prevent index signature
                router[method](this.route, controller.middleware || [], controller.callback);
            }
        },
        enumerable: true,
        configurable: true
    });
    return Route;
}());
exports.Route = Route;
