import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

const restServer = ''; // To define!

/**
 * Whenever this app makes request to server this determines to which
 * interceptors all requests will go forward.
 */
@Injectable()
export class CoreInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Changes request header in order to indicate to which interceptor this
   * request will be processed.
   * @param request Request made to server.
   * @param next Next request handler.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // When request's url starts with '/' it is assumed it is an API request
    // When request starts with '/docs' it is assumed that it is requesting
    // for docs asset, so ignores request.
    if (request.url.startsWith('/api')) {
      const requestChanges: any = {
        setHeaders: {
          authInterceptor: 'true'
        },
        url: restServer + request.url // Set new request's url
      };
      // Create new request to API
      request = request.clone(requestChanges);
    }

    // Continue...
    return next.handle(request);
  }
}
