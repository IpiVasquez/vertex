import { Component, OnInit } from '@angular/core';
import { VertexService } from 'app/vertex/vertex.service';
import { initChangeDetectorIfExisting } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  teams: Model.Team[];
  gameweeks: Model.Fixture[][];
  statics: Model.BootstrapStatic;
  table: {
    shortName: string;
    name: string;
    matches: number;
    clearVictories: number;
    marginalVictories: number;
    marginalLost: number;
    clearLost: number;
    ties: number;
    points: number;
  }[];

  constructor(private vertex: VertexService) {}

  ngOnInit() {
    this.table = [];
    this.vertex.ready.subscribe(ready => {
      if (ready) {
        this.teams = this.vertex.teams;
        this.gameweeks = this.vertex.gameweeks;
        this.statics = this.vertex.statics;
        this.init();
      }
    });
  }

  init() {
    for (let team of this.teams) {
      this.table.push({
        shortName: team.shortName,
        name: team.name,
        matches: 0,
        clearVictories: 0,
        marginalVictories: 0,
        clearLost: 0,
        marginalLost: 0,
        ties: 0,
        points: 0
      });
    }

    for (let i = 0; i < this.statics.events.length; i++) {
      const event = this.statics.events[i];
      if (event.finished) {
        for (let fix of this.gameweeks[i]) {
          const awayScore = this.teams[fix.away].scores[i].reduce(
            (acc, v) => acc + v,
            0
          );
          const homeScore = this.teams[fix.home].scores[i].reduce(
            (acc, v) => acc + v,
            0
          );
          const dif = homeScore - awayScore;
          this.table[fix.away].matches++;
          this.table[fix.home].matches++;
          if (dif >= 20) {
            this.table[fix.home].clearVictories++;
            this.table[fix.away].clearLost++;
            this.table[fix.home].points += 3;
          } else if (dif > 0) {
            this.table[fix.home].marginalVictories++;
            this.table[fix.away].marginalLost++;
            this.table[fix.home].points += 2;
            this.table[fix.away].points += 1;
          } else if (dif <= -20) {
            this.table[fix.away].clearVictories++;
            this.table[fix.home].clearLost++;
            this.table[fix.away].points += 3;
          } else if (dif < 0) {
            this.table[fix.away].marginalVictories++;
            this.table[fix.home].marginalLost++;
            this.table[fix.away].points += 2;
            this.table[fix.home].points += 1;
          } else {
            this.table[fix.away].ties++;
            this.table[fix.home].ties++;
            this.table[fix.away].points += 1;
            this.table[fix.home].points += 1;
          }
        }
      } else {
        break;
      }
    }

    this.table.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else if (a.clearVictories > b.clearVictories) {
        return -1;
      } else if (a.clearVictories < b.clearVictories) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
