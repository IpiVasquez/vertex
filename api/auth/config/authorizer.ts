import { Response, Request, NextFunction } from 'express';

/**
 * [Middleware] Supposely this middleware should authorize or not whatever it
 * receives. TODO.
 * @param req Client request.
 * @param res Server response.
 * @param next Next http handler.
 */
export async function authorizer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Checks for token at Authorization header
  next();
}
