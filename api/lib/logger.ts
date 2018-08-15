// import * as dotenv from 'dotenv';
// dotenv.config();
import * as winston from 'winston';
import * as colors from 'colors';

import * as wConfig from 'api/config/winston';

const { combine, timestamp, printf, colorize } = winston.format;
wConfig.winstonConfig();

interface LoggerOptions {
  name?: string;
  color?: string;
  transports?: any;
}

export class Logger {
  public logger: winston.Logger;
  private name: string;
  private addColor: (s: string) => string;

  constructor(options: LoggerOptions = { name: 'untagged', color: 'blue' }) {
    this.addColor = getColorizer(options.color);
    this.name = options.name;

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      transports: options.transports || [
        new winston.transports.Console({
          handleExceptions: true,
          format: combine(
            colorize({ level: true }),
            timestamp(),
            printf(this.consoleFormat.bind(this))
          )
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error'
        })
      ]
    });
  }

  getLogger(source?: string, type?: string) {
    const obj = { label: type, source: source || this.name };
    return {
      info: (message: string, meta: any = {}) =>
        this.logger.info(message, Object.assign({}, obj, meta)),
      error: (message: string, meta: any = {}) =>
        this.logger.error(message, Object.assign({}, obj, meta)),
      warn: (message: string, meta: any = {}) =>
        this.logger.warn(message, Object.assign({}, obj, meta)),
      verbose: (message: string, meta: any = {}) =>
        this.logger.verbose(message, Object.assign({}, obj, meta)),
      debug: (message: string, meta: any = {}) =>
        this.logger.debug(message, Object.assign({}, obj, meta)),
      silly: (message: string, meta: any = {}) =>
        this.logger.silly(message, Object.assign({}, obj, meta))
    };
  }

  private consoleFormat(info: any) {
    const addColor = getColorizer(info.label) || this.addColor;
    let out = colors.reset(`${info.level}${colors.reset('\t  ')}`);
    const tab = (info.source || this.name).length > 11 ? '\t' : '\t\t';
    out += colors.bold(addColor(`[${info.source || this.name}]${tab}`));
    out += colors.italic(info.message);
    out += colors.reset(' ');
    return out;
  }

  info = (message: string, meta?: any) => this.logger.info(message, meta);
  error = (message: string, meta?: any) => this.logger.error(message, meta);
  debug = (message: string, meta?: any) => this.logger.debug(message, meta);
  silly = (message: string, meta?: any) => this.logger.silly(message, meta);
  warn = (message: string, meta?: any) => this.logger.warn(message, meta);
  verbose = (message: string, meta?: any) => this.logger.verbose(message, meta);
}

export const masterLogger = new Logger();

function getColorizer(type?: string) {
  switch (type) {
    case 'red':
    case 'module':
      return colors.red;
    case 'blue':
    case 'model':
      return colors.blue;
    case 'yellow':
      return colors.yellow;
    case 'green':
    case 'controller':
      return colors.green;
    case 'cyan':
    case 'config':
    case 'middleware':
      return colors.cyan;
    case 'purple':
    case 'lib':
    case 'magenta':
      return colors.magenta;
    case 'black':
    case 'white':
    case 'server':
      return colors.bgRed;
    case 'app':
      return colors.bgGreen;
    default:
      return colors.rainbow;
  }
}
