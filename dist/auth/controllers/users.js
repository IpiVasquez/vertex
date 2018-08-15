"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("api/auth/models");
var lib_1 = require("api/lib");
/**
 * Retrieves information about users. Users may get filtered with query parameters.
 */
exports.users = new lib_1.Route('/users', {
    get: {
        callback: get
    }
});
function get(req, res) {
    models_1.User.find(req.query)
        .then(function (us) {
        var response;
        if (us) {
            // To avoid _id and __v
            // TODO: Some properties must not be shown
            response = us.map(function (u) { return ({
                email: u.email,
                profile: u.profile
            }); });
        }
        res.json(response || []);
    })
        .catch(function (error) {
        return res.status(500).json({
            code: 1000,
            type: 'Unknown error',
            message: error
        });
    });
}
