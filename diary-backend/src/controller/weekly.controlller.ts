import {NextFunction, Request, Response} from 'express';
import {weeklyService} from '../service/weekly.service';
import {RequestWithUser} from '../interface/auth.interface';
import {CreateWeeklyDto, GetWeeklyDto} from '@/dto/weekly.dto';
import {WeeklyDiary} from '@/interface/weeklyDiary.interface';

export class weeklyController {
  public weekly = new weeklyService();

  public getweekly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const date = req.params.date;
      const user_id = Number(req.user.id);
      const findweeklyDiary = await this.weekly.weeklyRead(date, user_id);

      res.status(200).json({data: findweeklyDiary, message: 'findDiary'});
    } catch (error) {
      next(error);
    }
  };

  public createweekly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getweeklyData: GetWeeklyDto = req.body;
      const createData: CreateWeeklyDto = {
        user_id: Number(req.user.id),
        ...getweeklyData,
      };
      const createweeklyData: WeeklyDiary = await this.weekly.weeklyWrite(
        createData,
      );

      res.status(201).json({data: createweeklyData, message: 'created'});
    } catch (error) {
      next(error);
    }
  };

  public updateweekly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getweeklyData: GetWeeklyDto = req.body;
      const createweeklyData: CreateWeeklyDto = {
        user_id: Number(req.user.id),
        ...getweeklyData,
      };
      const updateweeklyData: any = await this.weekly.weeklyUpdate(
        createweeklyData,
      );
      res.status(200).json({data: updateweeklyData, message: 'updated'});
    } catch (error) {
      next(error);
    }
  };

  public deleteweekly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {date} = req.body;
      const userId = Number(req.user.id);
      const deleteweeklyData: any = await this.weekly.weeklyDelete(
        date,
        userId,
      );

      res.status(200).json({data: deleteweeklyData, message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
