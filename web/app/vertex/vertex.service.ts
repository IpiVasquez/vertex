import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

const totalReq = 3;

@Injectable({
  providedIn: 'root'
})
export class VertexService {
  _ready = new BehaviorSubject<boolean>(false);
  statics: Model.BootstrapStatic;
  gameweeks: Model.Fixture[][];
  teams: Model.Team[];
  responses = 0;

  constructor(private http: HttpClient) {
    this.http.get<Model.BootstrapStatic>('/api/bootstrap/static').subscribe(
      statics => this.init({ statics: statics }),
      err => {
        this._ready.error({ message: 'When retrieving static' });
        console.error(err);
      }
    );

    this.http
      .get<Model.Team[]>('/api/fpl/teams')
      .subscribe(
        res => this.init({ teams: res }),
        () => this._ready.error({ message: 'When retrieving teams' })
      );

    this.http
      .get<Model.Fixture[][]>('/api/bootstrap/fixtures')
      .subscribe(
        gws => this.init({ gws: gws }),
        () => this._ready.error({ message: 'When retrieving fixtures' })
      );
  }

  init(data: {
    statics?: Model.BootstrapStatic;
    teams?: Model.Team[];
    gws?: Model.Fixture[][];
  }) {
    this.statics = data.statics || this.statics;
    this.teams = data.teams || this.teams;
    this.gameweeks = data.gws || this.gameweeks;

    if (++this.responses >= totalReq) {
      let reqs = 0,
        totalReqs = 0;
      for (let i = 0; i < this.statics.events.length; i++) {
        const event = this.statics.events[i];
        if (event.current) {
          this.statics.nextEvent = i + 2; // Plus two because index start at 0
        }

        if (event.current || event.finished) {
          totalReqs += this.teams.length;
          // Check each score
          for (let team of this.teams) {
            this.http
              .get<Model.FPlayer[]>(
                `/api/fpl/players/${i + 1}?code=${team.code}`
              )
              .subscribe(players => {
                reqs++;
                team.scores.push(
                  players.map(p => p.history.points - p.history.transferCost)
                );

                if (reqs === totalReqs) {
                  this._ready.next(true);
                }
              });
          }
        }
      }
    }
  }

  get ready(): Observable<any> {
    return this._ready.asObservable();
  }
}
