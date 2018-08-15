import * as mongoose from 'mongoose';

import { masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('config:mongo', 'config');

export async function mongoConnect(uri = process.env.MONGO_URI) {
  try {
    logger.info('Mongo DB at: ' + uri);
    await mongoose.connect(
      uri,
      { useNewUrlParser: true }
    );
    logger.info('Successful MongoDB connection');
  } catch (e) {
    logger.error('MongoDB connection failed', { mongoUri: uri });
    process.exit(1);
  }
}
