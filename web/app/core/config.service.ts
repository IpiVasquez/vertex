import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { DatabaseService } from 'app/core/database.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = new BehaviorSubject<Api.Config>({});

  constructor(private http: HttpClient, private db: DatabaseService) {
    this.http.get<Api.Config>('/api/config').subscribe(
      v => {
        this.db.setConfig(v);
        this.config.next(v);
      },
      error => {
        this.db.getConfig().subscribe(config => this.config.next(config));
        console.log(error);
      }
    );
  }
}
