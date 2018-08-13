import { Route } from 'api/lib';

/**
 * Sends configurations shared across server and client.
 */
export const config = new Route('/config', {
  get: {
    callback: (_, res) => {
      const conf: any = {};
      res.json(conf);
    }
  }
});
