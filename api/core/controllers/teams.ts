import { Request, Response } from 'express';

import { Route, masterLogger } from 'api/lib';
import { Team } from 'api/core/models';

const logger = masterLogger.getLogger('core:teams', 'controller');

/**
 *
 */
export const teams = new Route('/fpl/teams', {
  get: { callback: getCb }
});

async function getCb(req: Request, res: Response) {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (e) {
    logger.debug(e);
    res.json(500).json({ message: 'Something really unexpected happened' });
  }
}
