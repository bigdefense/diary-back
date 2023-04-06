import DailyDao from '@/dao/daily.dao';
import {createDailyDto} from '@/dto/daily.dto';
import {DailyDairy} from '@/interface/dailyDairy.interface';
import exceptError from '@/utils/excetpError';
import {logger} from '@/utils/logger';
import {isEmpty} from 'class-validator';

export class DailyService {
  public daily = new DailyDao();

  public dailyWrite = async (dailyDairy: createDailyDto) => {
    if (isEmpty(dailyDairy))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const existDaily = await this.daily.findDailyDairyByDate(
        dailyDairy.date,
        dailyDairy.user_id,
      );
      if (existDaily) return existDaily;
      const createDailyData: any = await this.daily.createDaily(dailyDairy);
      return createDailyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public dailyRead = async (dailyDate: string, user_id: number) => {
    if (isEmpty(dailyDate))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const findDiary: DailyDairy = await this.daily.findDailyDairyByDate(
        dailyDate,
        user_id,
      );
      return findDiary;
    } catch (error) {
      logger.error(error);
    }
  };
  public dailyUpdate = async (dailyDairy: createDailyDto) => {
    if (isEmpty(dailyDairy))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const updateDailyData = await this.daily.updateDailyDairyByDate(
        dailyDairy,
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
      await this.daily.deleteDailyDairyByDate(dailyDate, user_id);
    } catch (error) {
      logger.error(error);
    }
  };
}
