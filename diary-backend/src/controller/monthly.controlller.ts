import {NextFunction, Request, Response} from 'express';
import {GetMonthlyDto, CreateMonthlyDto} from '../dto/monthly.dto';
import {MonthlyDiary} from '../interface/monthlyDiary.interface';
import {MonthlyService} from '../service/monthly.service';
import {RequestWithUser} from '../interface/auth.interface';

export class MonthlyController {
  public Monthly = new MonthlyService();

  public getMonthly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const date = req.params.date;
      const user_id = Number(req.user.id);
      const {msg, code, result} = await this.Monthly.MonthlyRead(date, user_id);

      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };

  public createMonthly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getMonthlyData: GetMonthlyDto = req.body;
      const createData: CreateMonthlyDto = {
        user_id: Number(req.user.id),
        ...getMonthlyData,
      };
      const {msg, code, result} = await this.Monthly.MonthlyWrite(createData);

      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };

  public updateMonthly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getMonthlyData: GetMonthlyDto = req.body;
      const createMonthlyData: CreateMonthlyDto = {
        user_id: Number(req.user.id),
        ...getMonthlyData,
      };
      const {msg, code, result} = await this.Monthly.MonthlyUpdate(
        createMonthlyData,
      );
      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };

  public deleteMonthly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {date} = req.body;
      const userId = Number(req.user.id);
      const {msg, code, result} = await this.Monthly.MonthlyDelete(
        date,
        userId,
      );

      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };
}
