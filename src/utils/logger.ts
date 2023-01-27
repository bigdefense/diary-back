import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import {join} from 'path';

const {combine, timestamp, printf, colorize, splat} = winston.format;
const logDir: string = join(__dirname, 'logs');

const loggerFormat = () => {
  return combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    printf(
      ({timestamp, level, message}) => `${timestamp} ${level}: ${message}`,
    ),
  );
};
const debugTransport = () => {
  return new winstonDaily({
    level: 'debug',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/debug',
    filename: `%DATE%.log`,
    maxFiles: 30,
    json: false,
    zippedArchive: true,
  });
};

const errorTransport = () => {
  return new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/error',
    filename: `%DATE%.log`,
    maxFiles: 30,
    handleExceptions: true,
    json: false,
    zippedArchive: true,
  });
};

const consoleTransport = () => {
  return new winston.transports.Console({
    format: combine(splat(), colorize()),
  });
};

const logger = winston.createLogger({
  format: loggerFormat(),
  transports: [consoleTransport(), debugTransport(), errorTransport()],
});

const stream: {write: (message: string) => void} = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export {logger, stream};
