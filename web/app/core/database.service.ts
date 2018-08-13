import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// @ts-ignore
const PDB = require('pouchdb-browser');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private mdb: PouchDB.Database;

  constructor() {
    // Fucking Angular!
    this.mdb = new PDB.default.defaults()('metapos');
    this.mdb.info().then(console.log);
  }

  setConfig(conf: Api.Config) {
    this.mdb
      .get('config')
      // If it exists
      .then(oldConf => this.mdb.put(Object.assign(oldConf, conf)))
      // If it doesn't exist ... TODO: Validate it was because it doesn't exist?
      .catch(() => this.mdb.put(Object.assign({ _id: 'config' }, conf)));
  }

  getConfig(): Observable<Api.Config> {
    return new Observable<Api.Config>(observer => {
      this.mdb.get('config').then(conf => console.log(conf));
      observer.next({});
    });
  }
}
