// This file represents /bin/www
// To get typescript paths able to work
import * as dotenv from 'dotenv';
// Config environment before anything on API server starts
dotenv.config();

// If isn't TypeScript instance change paths to their aliases
if (!process.env.TS) {
  /**
   * TODO: Document why and how module-alias works along with tsconfig-paths...
   */
  require('module-alias/register');
}

import * as http from 'http';

import { masterLogger } from 'api/lib';
import { Metapos } from 'api/app';

const logger = masterLogger.getLogger('server', 'server');
process.on('uncaughtException', err =>
  logger.error('Uncaught exception', { error: err })
);
process.on('unhandledRejection', err =>
  logger.error('Unhandled rejection', { error: err })
);
// Need to be provided at .env
const port = Number(process.env.PORT);
const mongoUri = process.env.MONGO_URI;

logger.verbose('Creating app');
const metapos = new Metapos(mongoUri, port);

const server = http.createServer(metapos.app);
server.listen(port);

logger.info('Server listening on port ' + port);
