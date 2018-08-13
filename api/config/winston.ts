import * as winston from 'winston';

export function winstonConfig(target = winston) {
  target.clear();
  target.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'rainbow'
  });
}
