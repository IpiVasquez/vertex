import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const appList: App[] = [];

/**
 * Provides information to make shell work.
 */
@Injectable({
  providedIn: 'root'
})
export class ShellService {
  constructor() {}

  /**
   * Returns an observable with information about the apps in the shell.
   * @returns An observable with a list of apps for the shell.
   */
  get apps(): Observable<App[]> {
    return of(appList);
    // return Observable.create(observer => {
    //   observer.next(observer);
    //   // Some other actions (check plus features)
    // });
  }
}

// Apps structure
export interface App {
  description: string;
  name: string;
  icon: string;
  url: string;
}
