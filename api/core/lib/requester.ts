import * as https from 'https';

import { masterLogger } from 'api/lib';

const logger = masterLogger.getLogger('core:requester', 'lib');

export function requester<T>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    https
      .get(url, resp => {
        let body = '';
        let chunks = 0;
        resp.on('data', chunk => {
          body += chunk;
          chunks++;
        });
        resp.on('end', () => {
          logger.silly('Total chunks: ' + chunks);
          const data = <any>JSON.parse(body);
          resolve(data);
        });
        resp.on('error', err => reject(err));
      })
      .on('error', err => {
        logger.error(err.message);
        reject(err);
      });
  });
}
