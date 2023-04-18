import {NextFunction, Request, Response} from 'express';
import {GetDailyDto, CreateDailyDto} from '../dto/daily.dto';
import {DailyDiary} from '../interface/dailyDiary.interface';
import {DailyService} from '../service/daily.service';
import {RequestWithUser} from '../interface/auth.interface';

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
      const findDailyDiary = await this.daily.dailyRead(date, user_id);

      res.status(200).json({data: findDailyDiary, message: 'findDiary'});
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
      const getDailyData: GetDailyDto = req.body;
      const createData: CreateDailyDto = {
        user_id: Number(req.user.id),
        ...getDailyData,
      };
      const createDailyData: DailyDiary = await this.daily.dailyWrite(
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
      const getDailyData: GetDailyDto = req.body;
      const createDailyData: CreateDailyDto = {
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
