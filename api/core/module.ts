import { config } from 'api/core/controllers';
import { MetaposModule } from 'api/lib';

export const core = new MetaposModule(async metapos => {
  config.router = metapos.apiRouter;
});
