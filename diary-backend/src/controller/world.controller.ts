import {Request, Response, NextFunction} from 'express';

class worldController {
  public world = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({message: 'World'});
    } catch (error) {
      next(error);
    }
  };
}
export default worldController;
