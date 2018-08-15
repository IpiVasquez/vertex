import { Request, Response } from 'express';

import { requester } from 'api/core/lib/requester';
import { Route, masterLogger } from 'api/lib';
import { Team } from 'api/core/models';
import { PlayerPick } from 'api/core/models/playerPick';

const logger = masterLogger.getLogger('core:player', 'controller');

function getPlayerUrl(id: number, event: number) {
  const fpl = 'https://fantasy.premierleague.com/drf/entry/';
  return `${fpl}${id}/event/${event}/picks`;
}

/**
 *
 */
export const players = new Route('/fpl/players/:event', {
  get: { callback: getCb }
});

async function getCb(req: Request, res: Response) {
  const query = req.query;
  const event = Number(req.params.event);
  if (event <= 0 && event > 38) {
    res.status(400).json({ message: 'Busted!' });
    return;
  }

  try {
    const teams = await Team.find(query);
    const promises = [];
    for (let i = 0; i < teams.length; i++) {
      for (let player of teams[i].players) {
        const p = await PlayerPick.findOne({
          url: getPlayerUrl(player, event)
        });
        if (p) {
          promises.push(
            PlayerPick.findOne({
              url: getPlayerUrl(player, event)
            })
          );
        } else {
          const p = requester<any>(getPlayerUrl(player, event));
          // console.log(p);
          promises.push(p);
        }
      }
    }

    const players = (await Promise.all(promises)).map(player => ({
      history: {
        id: player.entry_history.id,
        points: player.entry_history.points,
        totalPoints: player.entry_history.total_points,
        transfers: player.entry_history.event_transfers,
        transferCost: player.entry_history.event_transfers_cost
      }
    }));

    res.json(players);
  } catch (e) {
    logger.error(e);
    res.json(500).json({ message: 'Something really unexpected happened' });
  }
}
