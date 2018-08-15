import * as fs from 'fs';

const file = fs.readFileSync('./static.json');
const data = <any>JSON.parse(file + '');
const teams = data.teams.map((team: any) => ({
  code: team.code,
  name: team.name,
  shortName: team.short_name,
  players: []
}));

console.log(JSON.stringify(teams));
