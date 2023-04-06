import {NextFunction, Request, Response} from 'express';
import {getDailyDto, createDailyDto} from '@/dto/daily.dto';
import {DailyDairy} from '@/interface/dailyDairy.interface';
import {DailyService} from '@/service/daily.service';
import {RequestWithUser} from '@/interface/auth.interface';

export class DailyController {
  public daily = new DailyService();

  public getDaily = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const date = req.params.date;
      const user_id = Number(req.user.id);
      const findDailyDairy = await this.daily.dailyRead(date, user_id);

      res.status(200).json({data: findDailyDairy, message: 'findDiary'});
    } catch (error) {
      next(error);
    }
  };

  public createDaily = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getDailyData: getDailyDto = req.body;
      const createData: createDailyDto = {
        user_id: Number(req.user.id),
        ...getDailyData,
      };
      const createDailyData: DailyDairy = await this.daily.dailyWrite(
        createData,
      );

      res.status(201).json({data: createDailyData, message: 'created'});
    } catch (error) {
      next(error);
    }
  };

  public updateDaily = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getDailyData: getDailyDto = req.body;
      const createDailyData: createDailyDto = {
        user_id: Number(req.user.id),
        ...getDailyData,
      };
      const updateDailyData: any = await this.daily.dailyUpdate(
        createDailyData,
      );
      res.status(200).json({data: updateDailyData, message: 'updated'});
    } catch (error) {
      next(error);
    }
  };

  public deleteDaily = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {date} = req.body;
      const userId = Number(req.user.id);
      const deleteDailyData: any = await this.daily.dailyDelete(date, userId);

      res.status(200).json({data: deleteDailyData, message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
