import { Router, RequestHandler } from 'express';

import { masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('routes', 'lib');

/**
 * Defines routes behavior.
 */
export class Route {
  /**
   * @param route Indicates which URL this controls.
   * @param constrollers Defines how each method in this route will behave and
   * which middleware will use.
   */
  constructor(private route: string, private controllers: HTTPMethods) {}

  /**
   * Sets this route in the router given.
   * @param router Where to set this route.
   */
  set router(router: Router) {
    // Goes through each method provided in controllers
    for (const method of Object.keys(this.controllers)) {
      logger.info(`Adding ${method} method to ${this.route}`);
      const controller: HTTPMethod = this.controllers[method];
      // Prevent index signature
      (<any>router)[method](
        this.route,
        controller.middleware || [],
        controller.callback
      );
    }
  }
}

export interface HTTPMethod {
  callback: RequestHandler;
  middleware?: RequestHandler | RequestHandler[];
}

export interface HTTPMethods {
  [index: string]: HTTPMethod;
  get?: HTTPMethod;
  post?: HTTPMethod;
}
