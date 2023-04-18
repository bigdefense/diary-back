import DailyDao from '../dao/daily.dao';
import {CreateDailyDto} from '../dto/daily.dto';
import {DailyDiary} from '../interface/dailyDiary.interface';
import exceptError from '../utils/excetpError';
import {logger} from '../utils/logger';
import {isEmpty} from 'class-validator';

export class DailyService {
  public daily = new DailyDao();

  public dailyWrite = async (dailyDiary: CreateDailyDto) => {
    if (isEmpty(dailyDiary))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const existDaily = await this.daily.findDailyDiaryByDate(
        dailyDiary.date,
        dailyDiary.user_id,
      );
      if (existDaily) return existDaily;
      const createDailyData: any = await this.daily.createDaily(dailyDiary);
      return createDailyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public dailyRead = async (dailyDate: string, user_id: number) => {
    if (isEmpty(dailyDate))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const findDiary: DailyDiary | null =
        await this.daily.findDailyDiaryByDate(dailyDate, user_id);
      return findDiary;
    } catch (error) {
      logger.error(error);
    }
  };
  public dailyUpdate = async (dailyDiary: CreateDailyDto) => {
    if (isEmpty(dailyDiary))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const updateDailyData = await this.daily.updateDailyDiaryByDate(
        dailyDiary,
      );
      return updateDailyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public dailyDelete = async (dailyDate: string, user_id: number) => {
    if (isEmpty(dailyDate))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      await this.daily.deleteDailyDiaryByDate(dailyDate, user_id);
    } catch (error) {
      logger.error(error);
    }
  };
}
