import MonthlyDao from '@/dao/monthly.dao';
import {CreateMonthlyDto} from '@/dto/monthly.dto';
import {MonthlyDiary} from '@/interface/monthlyDiary.interface';
import exceptError from '@/utils/excetpError';
import {logger} from '@/utils/logger';
import {isEmpty} from 'class-validator';

export class MonthlyService {
  public Monthly = new MonthlyDao();

  public MonthlyWrite = async (MonthlyDiary: CreateMonthlyDto) => {
    if (isEmpty(MonthlyDiary))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const existMonthly = await this.Monthly.findMonthlyDiaryByDate(
        MonthlyDiary.date,
        MonthlyDiary.user_id,
      );
      if (existMonthly) return existMonthly;
      const createMonthlyData: any = await this.Monthly.createMonthly(
        MonthlyDiary,
      );
      return createMonthlyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public MonthlyRead = async (MonthlyDate: string, user_id: number) => {
    if (isEmpty(MonthlyDate))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const findAllDiary: Array<MonthlyDiary> | null =
        await this.Monthly.findAllMonthlyDiaryByDate(MonthlyDate, user_id);
      return findAllDiary;
    } catch (error) {
      logger.error(error);
    }
  };
  public MonthlyUpdate = async (MonthlyDiary: CreateMonthlyDto) => {
    if (isEmpty(MonthlyDiary))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const updateMonthlyData = await this.Monthly.updateMonthlyDiaryByDate(
        MonthlyDiary,
      );
      return updateMonthlyData;
    } catch (error) {
      logger.error(error);
    }
  };

  public MonthlyDelete = async (MonthlyDate: string, user_id: number) => {
    if (isEmpty(MonthlyDate))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      await this.Monthly.deleteMonthlyDiaryByDate(MonthlyDate, user_id);
    } catch (error) {
      logger.error(error);
    }
  };
}
