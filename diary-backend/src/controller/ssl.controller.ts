import {Request, Response, NextFunction} from 'express';

class sslController {
  public pkiValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .sendFile(
          process.cwd() + '/config/FEB1092FBA22840526B86DE33A14908D.txt',
        );
    } catch (error) {
      next(error);
    }
  };
}
export default sslController;
