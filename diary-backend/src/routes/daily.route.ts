import {Router} from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import {GetDailyDto, DeleteDailyDto} from '../dto/daily.dto';
import {DailyController} from '../controller/daily.controlller';
import {authMiddleware} from '../middleware/auth.middleware';

class Daily {
  public path = '/daily';
  public router = Router();
  public usersController = new DailyController();
  constructor() {
    this.router.get(
      `${this.path}/read/:date`,
      authMiddleware,
      // validationMiddleware(GetDailyDto, 'body'),
      this.usersController.getDaily,
    );
    this.router.post(
      `${this.path}/write`,
      authMiddleware,
      validationMiddleware(GetDailyDto, 'body'),
      this.usersController.createDaily,
    );
    this.router.post(
      `${this.path}/update`,
      authMiddleware,
      validationMiddleware(GetDailyDto, 'body'),
      this.usersController.updateDaily,
    );
    this.router.post(
      `${this.path}/delete`,
      authMiddleware,
      validationMiddleware(DeleteDailyDto, 'body'),
      this.usersController.deleteDaily,
    );
  }
}

export default Daily;
