import * as mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  players: { type: [Number], required: true },
  playerTwitters: { type: [String], default: [] },
  scores: { type: [[Number]], default: [] },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  code: { type: Number, required: true, unique: true }
}).pre('save', function() {
  // @ts-ignore
  while (this.playerTwitters.length < this.players.length) {
    // @ts-ignore
    this.playerTwitters.push('');
  }
});

export type MongoTeam = Model.Team & mongoose.Document;

export const Team = mongoose.model<MongoTeam>('teams', teamSchema);
