import {NextFunction, Request, Response} from 'express';
import {weeklyService} from '../service/weekly.service';
import {RequestWithUser} from '../interface/auth.interface';
import {CreateWeeklyDto, GetWeeklyDto} from '@/dto/weekly.dto';

export class weeklyController {
  public weekly = new weeklyService();

  public getweekly = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const string_of_week = req.params.date;
      const user_id = Number(req.user.id);
      const {msg, code, result} = await this.weekly.weeklyRead(
        string_of_week,
        user_id,
      );

      res.status(200).json({msg, code, result});
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
      const createData: CreateWeeklyDto | null = {
        user_id: Number(req.user.id),
        ...getweeklyData,
      };
      const {msg, code, result} = await this.weekly.weeklyWrite(createData);

      res.status(200).json({msg, code, result});
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
      const {msg, code, result} = await this.weekly.weeklyUpdate(
        createweeklyData,
      );
      res.status(200).json({msg, code, result});
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
      const {number_of_week, string_of_week} = req.body;
      const userId = Number(req.user.id);
      const {msg, code, result} = await this.weekly.weeklyDelete(
        string_of_week,
        number_of_week,
        userId,
      );

      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };
}
