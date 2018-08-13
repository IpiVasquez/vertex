import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';

/**
 * Transforms a button in a Google auth button.
 */
@Directive({
  selector: '[authGoogleButton]'
})
export class GSinginButtonDirective {
  @Output() token = new EventEmitter<string>();
  constructor(private socialAuth: AuthService) {}

  /**
   * Authenticates user via Google.
   */
  @HostListener('click')
  emitUser() {
    this.socialAuth
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(user => this.token.emit(user.idToken))
      .catch(err => console.error(err));
  }
}
