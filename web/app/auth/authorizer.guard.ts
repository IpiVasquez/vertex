import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Authenticator } from 'app/auth/authenticator.service';

@Injectable({
  providedIn: 'root'
})
export class Authorizer implements CanActivate {
  constructor(private auth: Authenticator, private router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const v = this.auth.isLogged();

    if (!v) {
      switch (state.url) {
        case '':
        case '/':
          this.router.navigate(['/about']);
          break;
        default:
          this.auth.redirectUrl = state.url;
          this.router.navigate(['/sign']);
          break;
      }
    }

    return v;
  }
}
