import {Request, Response, NextFunction} from 'express';

class sslController {
  public pkiValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .sendFile(
          process.cwd() + '/config/59F4AC7AC34FB82BC5CCE78D79BBA4F6.txt',
        );
    } catch (error) {
      next(error);
    }
  };
}
export default sslController;
