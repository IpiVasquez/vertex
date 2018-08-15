import * as mongoose from 'mongoose';

const playerPickSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true },
  entry_history: Object,
  event: Object,
  picks: [Object]
});

export type MongoPlayerPick = Model.FPlayer &
  mongoose.Document & { url: string };

export const PlayerPick = mongoose.model<MongoPlayerPick>(
  'playerPicks',
  playerPickSchema
);
