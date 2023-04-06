import {Router} from 'express';
import validationMiddleware from '@/middleware/validation.middleware';
import {GetMonthlyDto} from '@/dto/monthly.dto';
import {MonthlyController} from '@/controller/monthly.controlller';
import authMiddleware from '@/middleware/auth.middleware';

class Monthly {
  public path = '/monthly';
  public router = Router();
  public usersController = new MonthlyController();
  constructor() {
    this.router.get(
      `${this.path}/read/:date`,
      validationMiddleware(GetMonthlyDto, 'body'),
      authMiddleware,
      this.usersController.getMonthly,
    );
    this.router.post(
      `${this.path}/write`,
      validationMiddleware(GetMonthlyDto, 'body'),
      authMiddleware,
      this.usersController.createMonthly,
    );
    this.router.post(
      `${this.path}/update`,
      validationMiddleware(GetMonthlyDto, 'body'),
      authMiddleware,
      this.usersController.updateMonthly,
    );
    this.router.post(
      `${this.path}/delete`,
      validationMiddleware(GetMonthlyDto, 'body'),
      authMiddleware,
      this.usersController.deleteMonthly,
    );
  }
}

export default Monthly;
