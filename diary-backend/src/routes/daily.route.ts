import {Router} from 'express';
import validationMiddleware from '@/middleware/validation.middleware';
import {getDailyDto} from '@/dto/daily.dto';
import {DailyController} from '@/controller/daily.controlller';
import authMiddleware from '@/middleware/auth.middleware';

class Daily {
  public path = '/daily';
  public router = Router();
  public usersController = new DailyController();
  constructor() {
    this.router.get(
      `${this.path}/read/:date`,
      authMiddleware,
      validationMiddleware(getDailyDto, 'body'),
      this.usersController.getDaily,
    );
    this.router.post(
      `${this.path}/write`,
      authMiddleware,
      validationMiddleware(getDailyDto, 'body'),
      this.usersController.createDaily,
    );
    this.router.post(
      `${this.path}/update`,
      authMiddleware,
      validationMiddleware(getDailyDto, 'body'),
      this.usersController.updateDaily,
    );
    this.router.post(
      `${this.path}/delete`,
      authMiddleware,
      validationMiddleware(getDailyDto, 'body'),
      this.usersController.deleteDaily,
    );
  }
}

export default Daily;
