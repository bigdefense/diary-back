import {CreateWeeklyDto} from '@/dto/weekly.dto';
import weeklyDao from '../dao/weekly.dao';
import exceptError from '../utils/excetpError';
import {logger} from '../utils/logger';
import {isEmpty} from 'class-validator';
import {WeeklyDiary} from '@/interface/weeklyDiary.interface';

export class weeklyService {
  public weekly = new weeklyDao();

  public weeklyWrite = async (weeklyDiary: CreateWeeklyDto) => {
    if (isEmpty(weeklyDiary))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const existweekly = await this.weekly.findWeeklyDiaryByDate(
        weeklyDiary.date,
        weeklyDiary.user_id,
      );
      if (existweekly) return existweekly;
      const createweeklyData: any = await this.weekly.createWeekly(weeklyDiary);
      return createweeklyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public weeklyRead = async (weeklyDate: string, user_id: number) => {
    if (isEmpty(weeklyDate))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const findDiary: WeeklyDiary[] | null =
        await this.weekly.findWeeklyDiaryByWeekRange(weeklyDate, user_id);
      return findDiary;
    } catch (error) {
      logger.error(error);
    }
  };
  public weeklyUpdate = async (weeklyDiary: CreateWeeklyDto) => {
    if (isEmpty(weeklyDiary))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const updateweeklyData = await this.weekly.updateWeeklyDiaryByDate(
        weeklyDiary,
      );
      return updateweeklyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public weeklyDelete = async (weeklyDate: string, user_id: number) => {
    if (isEmpty(weeklyDate))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      await this.weekly.deleteWeeklyDiaryByDate(weeklyDate, user_id);
    } catch (error) {
      logger.error(error);
    }
  };
}
