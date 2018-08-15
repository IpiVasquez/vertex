"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var teamSchema = new mongoose.Schema({
    players: { type: [Number], required: true },
    playerTwitters: { type: [String], default: [] },
    scores: { type: [[Number]], default: [] },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    code: { type: Number, required: true, unique: true }
}).pre('save', function () {
    // @ts-ignore
    while (this.playerTwitters.length < this.players.length) {
        // @ts-ignore
        this.playerTwitters.push('');
    }
});
exports.Team = mongoose.model('teams', teamSchema);
