import { Request, Response } from 'express';

import { requester } from 'api/core/lib/requester';
import { Route, masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('core:bootstraper', 'controller');
const bootstraper = 'https://fantasy.premierleague.com/drf/bootstrap-static';

/**
 *
 */
export const fplBootstrap = new Route('/bootstrap/static', {
  get: { callback: getCb }
});

async function getCb(_: Request, res: Response) {
  try {
    const data = await requester<any>(bootstraper);
    res.json({
      teams: data.teams,
      events: data.events.map(event => ({
        name: event.name,
        deadlineTime: event.deadline_time_epoch * 1000,
        finished: event.finished,
        deadlineFormatted: event.deadline_time_formatter,
        current: event.is_current,
        next: event.is_next
      })),
      nextEvent: data['next-event']
    });
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ message: 'Something really unexpected happened' });
  }
}
