import { Request, Response } from 'express';

import { User } from 'api/auth/models';
import { Route } from 'api/lib';

/**
 * Retrieves information about users. Users may get filtered with query parameters.
 */
export const users = new Route('/users', {
  get: {
    callback: get
  }
});

function get(req: Request, res: Response) {
  User.find(req.query)
    .then(us => {
      let response;
      if (us) {
        // To avoid _id and __v
        // TODO: Some properties must not be shown
        response = us.map(u => ({
          email: u.email,
          profile: u.profile
        }));
      }
      res.json(response || []);
    })
    .catch(error =>
      res.status(500).json({
        code: 1000,
        type: 'Unknown error',
        message: error
      })
    );
}
