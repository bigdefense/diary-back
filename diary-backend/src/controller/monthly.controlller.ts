import {NextFunction, Request, Response} from 'express';
import {GetMonthlyDto, CreateMonthlyDto} from '@/dto/monthly.dto';
import {MonthlyDiary} from '@/interface/monthlyDiary.interface';
import {MonthlyService} from '@/service/monthly.service';
import {RequestWithUser} from '@/interface/auth.interface';

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
      const findMonthlyDiary = await this.Monthly.MonthlyRead(date, user_id);

      res.status(200).json({data: findMonthlyDiary, message: 'findMonthDiary'});
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
      const createMonthlyData: MonthlyDiary = await this.Monthly.MonthlyWrite(
        createData,
      );

      res
        .status(201)
        .json({data: createMonthlyData, message: 'MonthDairycreated'});
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
      const updateMonthlyData: any = await this.Monthly.MonthlyUpdate(
        createMonthlyData,
      );
      res.status(200).json({data: updateMonthlyData, message: 'MonthUpdated'});
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
      const deleteMonthlyData: any = await this.Monthly.MonthlyDelete(
        date,
        userId,
      );

      res.status(200).json({data: deleteMonthlyData, message: 'MonthDeleted'});
    } catch (error) {
      next(error);
    }
  };
}
