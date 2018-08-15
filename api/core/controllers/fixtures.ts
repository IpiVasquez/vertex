import { Request, Response } from 'express';

import { requester } from 'api/core/lib/requester';
import { Route, masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('core:bootstraper', 'controller');
const bootstraper = 'https://fantasy.premierleague.com/drf/fixtures/';

/**
 *
 */
export const fixtures = new Route('/bootstrap/fixtures', {
  get: { callback: getCb }
});

async function getCb(_: Request, res: Response) {
  try {
    const data = await requester<any[]>(bootstraper);
    const gameweeks: Model.Fixture[][] = [];
    data.forEach(f => {
      const fixture: Model.Fixture = {
        gw: f.event - 1,
        home: f.team_h - 1,
        away: f.team_a - 1,
        match: f.event_day
      };
      if (gameweeks[fixture.gw]) {
        gameweeks[fixture.gw].push(fixture);
      } else {
        gameweeks[fixture.gw] = [fixture];
      }
    });
    res.json(
      gameweeks.map(gw => gw.sort((a, b) => (a.match < b.match ? -1 : 1)))
    );
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ message: 'Something really unexpected happened' });
  }
}
