import { Request, Response } from 'express';

import { getGoogleUser } from 'api/auth/lib';
import { User } from 'api/auth/models';
import { Route, masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('auth:login', 'controller');

/**
 * Logs user in.
 */
export const login = new Route('/login/:type', {
  post: { callback: postCb }
});

async function postCb(req: Request, res: Response) {
  const data = <Auth.LoginRequest>req.body;
  const type = req.params.type;
  let loginStrategy: (data: any) => Promise<Model.User>;

  if (type === 'local') {
    loginStrategy = local;
  } else if (type === 'google') {
    loginStrategy = google;
  } else {
    loginStrategy = async () => {
      const e = new Error('Bad request');
      e.name = 'Authorization error';
      throw e;
    };
  }

  try {
    const user = await loginStrategy(data);
    logger.debug('User found: ' + user.email);
    res.json({ token: user.tokenize() });
  } catch (e) {
    logger.warn(e.message);
    if (e.name === 'Authorization error') {
      res.status(401).json({
        type: e.name,
        message: e.message
      });
    } else {
      logger.error(e.message, { error: e });
      res.status(500).json({
        type: e.name,
        message: e.message
      });
    }
  }
}

/**
 * Local login strategy (Traditional email & password).
 * @param data Object provides email & password.
 */
async function local(data: any) {
  logger.debug('local => Searching for user');
  const user = await User.findOne({ email: data.email });
  if (user && !(await user.checkPassword(data.password))) {
    const e = new Error('Wrong password');
    e.name = 'Authorization error';
    throw e;
  } else if (!user) {
    const e = new Error('User not found');
    e.name = 'Authorization error';
    throw e;
  }

  return user;
}

/**
 * Google login strategy (OAuth2).
 * @param data Object provides Google token.
 */
async function google(data: any) {
  logger.debug('google => Verifying token');
  const email = (await getGoogleUser(data.token)).email;
  let user: Model.User;

  if (!(user = await User.findOne({ email: email }))) {
    const e = new Error();
    e.name = 'Authorization error';
    e.message = 'User not found';
    throw e;
  }

  return user;
}
