import {
  config,
  fplBootstrap,
  players,
  fixtures,
  teams
} from 'api/core/controllers';
import { MetaposModule } from 'api/lib';

export const core = new MetaposModule(async metapos => {
  config.router = metapos.apiRouter;
  fplBootstrap.router = metapos.apiRouter;
  players.router = metapos.apiRouter;
  teams.router = metapos.apiRouter;
  fixtures.router = metapos.apiRouter;
});
