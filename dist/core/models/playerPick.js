"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var playerPickSchema = new mongoose.Schema({
    url: { type: String, unique: true, required: true },
    entry_history: Object,
    event: Object,
    picks: [Object]
});
exports.PlayerPick = mongoose.model('playerPicks', playerPickSchema);
