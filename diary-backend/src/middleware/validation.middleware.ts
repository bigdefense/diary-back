import exceptError from '../utils/excetpError';
import {plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import {RequestHandler, Response, NextFunction} from 'express';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req: any, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(error.constraints ? error.constraints : ''),
          )
          .join(', ');
        next(new exceptError(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
