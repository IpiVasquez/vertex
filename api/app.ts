import { Application, Request, Response, Router, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';

import { mongoConnect } from 'api/config';
import { masterLogger } from 'api/lib';
import { auth } from 'api/auth';
import { core } from 'api/core';

const logger = masterLogger.getLogger('metapos', 'app');
const modules = [core, auth];
const apiUri = '/api';

export class Metapos {
  apiRouter: Router;
  app: Application;

  constructor(private dbUri: string, private port = 3000) {
    logger.verbose('Booting');
    // Creating express app
    this.app = express();
    this.config();
    this.initModules();
  }

  /**
   * Configures app: Adds port, body parser & static pages; connects to
   * databases, etc.
   */
  private async config() {
    this.app.set('port', this.port);
    const ngPath = path.resolve(process.cwd(), 'dist/public');
    // Add a router for the api
    this.addRouter();
    // Angular will handle every other route requested
    this.app.use(express.static(ngPath));
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(ngPath, 'index.html'));
      logger.debug('Angular app served');
    });
    await mongoConnect(this.dbUri);
  }

  /**
   * Configures the API router.
   */
  private addRouter() {
    logger.verbose('Setting api router at ' + apiUri);
    // Set API route as provided
    this.apiRouter = Router();
    this.app.use(apiUri, this.apiRouter);
    // Allows Angular app to use API while developing through CORS header
    let corsOptions;
    if (!this.isProduction) {
      corsOptions = { exposedHeaders: ['authorization'] };
    } else {
      logger.info('Production mode');
      // TODO: Only some origins
      corsOptions = { exposedHeaders: ['authorization'] };
    }
    logger.verbose('Adding CORS header setup');
    this.apiRouter.use(cors(corsOptions));
    // Set router to be able to handle json type and url encoded requests
    this.apiRouter.use(bodyParser.json());
    this.apiRouter.use(bodyParser.urlencoded({ extended: true }));
    // Error handler
    this.apiRouter.use(
      (err: Error, _: Request, res: Response, __: NextFunction) => {
        logger.error('Not catched: ' + err.name, { error: err });
        res.json({
          message: err.message,
          name: err.name
        });
      }
    );
  }

  initModules() {
    modules.forEach(m => m.init(this));
  }

  /**
   * Checks if this Server environment is set as production.
   * @returns true if this Server is in production, false otherwise.
   */
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}
