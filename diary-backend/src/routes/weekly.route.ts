import {Router} from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import {weeklyController} from '../controller/weekly.controlller';
import {authMiddleware} from '../middleware/auth.middleware';
import {GetWeeklyDto} from '@/dto/weekly.dto';

class Weekly {
  public path = '/weekly';
  public router = Router();
  public usersController = new weeklyController();
  constructor() {
    this.router.get(
      `${this.path}/read/:date`,
      authMiddleware,
      // validationMiddleware(GetweeklyDto, 'body'),
      this.usersController.getweekly,
    );
    this.router.post(
      `${this.path}/write`,
      authMiddleware,
      validationMiddleware(GetWeeklyDto, 'body'),
      this.usersController.createweekly,
    );
    this.router.post(
      `${this.path}/update`,
      authMiddleware,
      validationMiddleware(GetWeeklyDto, 'body'),
      this.usersController.updateweekly,
    );
    this.router.post(
      `${this.path}/delete`,
      authMiddleware,
      validationMiddleware(GetWeeklyDto, 'body'),
      this.usersController.deleteweekly,
    );
  }
}

export default Weekly;
