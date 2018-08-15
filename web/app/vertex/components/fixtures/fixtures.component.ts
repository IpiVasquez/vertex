import { Component, OnInit } from '@angular/core';
import { VertexService } from 'app/vertex/vertex.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.css']
})
export class FixturesComponent implements OnInit {
  gameweeks: Model.Fixture[][] = [];
  statics: Model.BootstrapStatic;
  teams: Model.Team[] = [];
  gw = 1;
  meta = {
    modalVisible: false,
    home: 0,
    away: 0
  };

  constructor(private vertex: VertexService) {}

  ngOnInit() {
    this.vertex.ready.subscribe(ready => {
      if (ready) {
        this.teams = this.vertex.teams;
        this.gameweeks = this.vertex.gameweeks;
        this.gw = this.vertex.statics.nextEvent - 1;
        this.statics = this.vertex.statics;
      }
    });
  }

  previousGW() {
    this.gw--;
  }

  nextGW() {
    this.gw++;
  }

  reduce(scores: number[] = []): string {
    return scores.length ? scores.reduce((acc, v) => acc + v, 0) + '' : '';
  }

  showCard(a: number, b: number) {
    this.meta.modalVisible = true;
    this.meta.home = a;
    this.meta.away = b;
  }

  makeArray(arr: any[] = []): number[] {
    return arr.map((_, i) => i);
  }

  getUrl(id: number, gw: number) {
    return `https://fantasy.premierleague.com/a/team/${id}/event/${gw}`;
  }
}
