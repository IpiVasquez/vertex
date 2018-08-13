import { Router } from 'express';

import { register, login, users } from 'api/auth/controllers';
import { MetaposModule, Route, masterLogger } from 'api/lib';
import { authenticator } from 'api/auth';

const logger = masterLogger.getLogger('auth', 'module');
const url = '/auth';
const routes: Route[] = [register, login];

/**
 * @module auth
 * This MetaPOS module handles authorization and authentication for all request.
 * Functions:
 * - Login
 * - Register
 * - Token authentication
 * - Authorization
 */
export const auth = new MetaposModule(async metapos => {
  logger.verbose('Adding authenticator to api');
  metapos.apiRouter.use(authenticator);
  logger.verbose('Creating router');
  const router = Router();
  logger.verbose('Adding routes to auth router');
  routes.forEach(r => (r.router = router));
  logger.verbose('Adding routes to api router');
  users.router = metapos.apiRouter;
  logger.verbose('Setting module base URL in %s', url);
  metapos.apiRouter.use(url, router);
});
