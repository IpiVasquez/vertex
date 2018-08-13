import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { SessionService } from 'app/core/session.service';
import { environment as env } from 'envs/environment';

const authTokenKeyName = env.authTokenKeyName;
const expiryKeyName = env.expiryKeyName;

@Injectable({
  providedIn: 'root'
})
export class Authenticator {
  redirectUrl: string;

  constructor(private http: HttpClient, private session: SessionService) {}

  /**
   * Request login to server.
   * @param req Request to send to server.
   * @returns An observable with server response.
   */
  login(loginReq: Request.Login, type: string): Observable<Response.Login> {
    return this.http
      .post<Response.Login>('/api/auth/login/' + type, loginReq)
      .pipe(tap(res => (this.token = res.token)));
  }

  /**
   * Logs user out by removing authentication token from local storage.
   */
  logout() {
    localStorage.removeItem(authTokenKeyName);
    localStorage.removeItem(expiryKeyName);
  }

  /**
   * Checks if user is logged in.
   */
  isLogged() {
    // Token exists and expiration time is greater than current time
    return this.session.isActive();
  }

  /**
   * Gets auth token from session.
   * @returns Authentication token.
   */
  get token(): string {
    return this.session.token;
  }

  /**
   * Sets auth token to session.
   */
  set token(token: string) {
    this.session.token = token;
  }

  get user(): Model.User {
    return this.session.user;
  }
}
