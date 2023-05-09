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
      if (existDaily)
        return {
          msg: '해당 일자에 다이어리가 존재합니다',
          code: 'DADU10001',
          result: existDaily,
        };
      const createDailyData: any = await this.daily.createDaily(dailyDiary);
      if (!createDailyData)
        return {
          msg: '다이어리 작성에 실패했습니다',
          code: 'DAC10002',
          result: createDailyData,
        };
      return {
        msg: '다이어리 작성에 성공했습니다',
        code: 'DAC10001',
        result: createDailyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `DailyWrite Error MSG ${error}`);
    }
  };

  public dailyRead = async (dailyDate: string, user_id: number) => {
    if (isEmpty(dailyDate))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const findDiary: DailyDiary | null =
        await this.daily.findDailyDiaryByDate(dailyDate, user_id);
      if (!findDiary)
        return {
          msg: '해당 일자에 다이어리가 존재하지 않습니다',
          code: 'DAR10002',
          result: findDiary,
        };
      return {
        msg: '해당 일자에 다이어리가 존재합니다',
        code: 'DAR10001',
        result: findDiary,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `DailyRead Error MSG ${error}`);
    }
  };
  public dailyUpdate = async (dailyDiary: CreateDailyDto) => {
    if (isEmpty(dailyDiary))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const updateDailyData = await this.daily.updateDailyDiaryByDate(
        dailyDiary,
      );
      if (!updateDailyData)
        return {
          msg: '해당 일자에 다이어리가 존재하지 않습니다',
          code: 'DAU10002',
          result: updateDailyData,
        };
      return {
        msg: '해당 일자를 수정 했습니다',
        code: 'DAU10001',
        result: updateDailyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `DailyUpdate Error MSG ${error}`);
    }
  };

  public dailyDelete = async (dailyDate: string, user_id: number) => {
    if (isEmpty(dailyDate))
      throw new exceptError(400, `You didn't give Daily info`);
    try {
      const deleteCnt = await this.daily.deleteDailyDiaryByDate(
        dailyDate,
        user_id,
      );
      if (!deleteCnt) {
        return {
          msg: '해당 일자에 다이어리가 존재하지 않습니다',
          code: 'DAD10002',
          result: deleteCnt,
        };
      }
      return {
        msg: '해당 일자의 다이어리를 삭제했습니다',
        code: 'DAD10001',
        result: deleteCnt,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `DailyDelete Error MSG ${error}`);
    }
  };
}
