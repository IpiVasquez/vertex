import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { SessionService } from 'app/core/session.service';

/**
 * When a request pass through this request it will check if this is supposed
 * to handle it through authInterceptor header.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.headers.get('authInterceptor') === 'true') {
      const token = this.session.token;
      if (token) {
        // Create new request to API
        request = request.clone({ setHeaders: { authorization: token } });
      }

      // Refresh token and continue...
      return next.handle(request).pipe(
        tap(
          event => {
            if (
              event instanceof HttpResponse &&
              event.headers.get('authorization')
            ) {
              // Refreshes token
              this.session.token = event.headers.get('authorization');
            }
          },
          error => {
            if (
              error instanceof HttpErrorResponse ||
              // error.status === 401 || // Unauthorized?
              error.error.name === 'TokenExpiredError'
            ) {
              // Logout because token is no longer valid
              this.session.end();
            }
          }
        )
      );
    }

    return next.handle(request);
  }
}
