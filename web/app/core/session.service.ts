import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

import { environment as env } from 'envs/environment';

interface TokenPayload {
  sub: string; // Who request it
  iat: number; // When it was issued
  exp: number; // Expiration time in seconds
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  payload: Model.User & TokenPayload;

  constructor() {
    if (!!this.token) {
      try {
        // Once the app starts it tries to decode token
        this.payload = jwtDecode(this.token);
      } catch (e) {
        this.end();
      }
    }
  }

  /**
   * Checks if a session is active
   */
  isActive() {
    // Token exists and expiration time is greater than current time
    return !!this.token && this.payload.exp * 1000 > +new Date();
  }

  /**
   * Ends the active session.
   */
  end() {
    localStorage.removeItem(env.authTokenKeyName);
  }

  get user(): Model.User {
    return {
      email: this.payload.email,
      profile: this.payload.profile,
      settings: this.payload.settings
    };
  }

  /**
   * Sets authorization token for current session and decodes its content.
   */
  set token(token: string) {
    this.payload = jwtDecode(token);
    localStorage.setItem(env.authTokenKeyName, token);
  }

  /**
   * Gets auth token from local storage.
   * @returns Authentication token.
   */
  get token() {
    return localStorage.getItem(env.authTokenKeyName);
  }
}
