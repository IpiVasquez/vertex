import { Request, Response } from 'express';

import { getGoogleUser } from 'api/auth/lib';
import { User } from 'api/auth/models';
import { Route, masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('auth:register', 'controller');

/**
 * Registers a new User.
 */
export const register = new Route('/register/:type', {
  post: { callback: post }
});

async function post(req: Request, res: Response) {
  const data = <Auth.RegisterRequest>req.body;
  const type = req.params.type;
  let registerStrategy: (data: any) => Promise<any>;
  if (type === 'local') {
    registerStrategy = local;
  } else if (type === 'google') {
    registerStrategy = google;
  } else {
    registerStrategy = async () => {
      const e = new Error('Bad request');
      e.name = 'Registration error';
      throw e;
    };
  }

  try {
    await registerStrategy(data);
    res.status(201).json({ message: 'OK' });
    logger.debug('User registered');
  } catch (e) {
    logger.warn(e.message, { error: e });
    if (/.*1 dup key.*/.test(e.message)) {
      // Dup key
      res.status(400).json({
        type: 'Registration error',
        message: 'User already registered'
      });
    } else if (e.name === 'ValidationError') {
      // Inconsistent
      res.status(400).json({
        type: 'Registration error',
        message: 'Inconsistent data'
      });
    } else {
      res.status(500).json({
        // What?
        type: e.name,
        message: 'What?'
      });
    }
  }
}

/**
 * Local register strategy (Traditional email & password).
 * @param data Object provides email, password & name.
 */
async function local(data: any) {
  logger.debug('Trying to register ' + data.email);
  await User.create({
    email: data.email,
    profile: { name: data.name },
    password: data.password
  });
}

/**
 * Google register strategy (OAuth2).
 * @param data Object provides Google token.
 */
async function google(data: any) {
  const u = await getGoogleUser(data.token);
  logger.debug('Trying to register ' + u.email);
  await User.create({
    email: u.email,
    profile: {
      name: u.name,
      lastName: u.lastName,
      image: u.image
    }
  });
}
