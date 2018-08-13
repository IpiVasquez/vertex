import { Response, Request, NextFunction } from 'express';

import { User } from 'api/auth/models';
import { masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('auth:authenticator', 'middleware');

/**
 * [Middleware] Retrieves information about user logged in. If user is logged
 * in then it sends his nformation through res.locals.
 * @param req Client request.
 * @param res Server response.
 * @param next Next http handler.
 */
export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Checks for token at Authorization header
  const token = <string>req.headers['authorization'];
  if (token) {
    // Async verifier
    try {
      // @ts-ignore
      const user = await User.detokenize(token);
      // Checking user actually exists
      if (user) {
        // Passing info to next handler
        res.locals.user = user;
        // Change the function used to respond request
        logger.debug(`Refreshing ${user.email} token`);
        res.set({
          authorization: user.tokenize()
        });
        next();
      } else {
        // ?
      }
    } catch (e) {
      // Async function requires to handle exceptions
      logger.warn(e.message);
      res.status(401).json({
        type: 'Authentication error',
        message: e.message
      });
    }
  } else {
    logger.verbose('Passing next handler without authentication');
    next();
  }
}
