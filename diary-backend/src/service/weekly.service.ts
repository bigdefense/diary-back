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
        weeklyDiary.user_id,
        weeklyDiary.string_of_week,
        weeklyDiary.number_of_week,
      );
      if (existweekly)
        return {
          msg: '해당 일자에 다이어리가 존재합니다',
          code: 'WDADU10002',
          result: existweekly,
        };
      const createweeklyData = await this.weekly.createWeekly(weeklyDiary);
      if (!createweeklyData)
        return {
          msg: '다이어리 작성에 실패했습니다',
          code: 'WDAC10002',
          result: createweeklyData,
        };

      return {
        msg: '다이어리 작성에 성공했습니다',
        code: 'WDAC10001',
        result: createweeklyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `weeklyWrite Error MSG ${error}`);
    }
  };

  public weeklyRead = async (string_of_week: string, user_id: number) => {
    if (isEmpty(string_of_week))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const findDiary: WeeklyDiary[] | null =
        await this.weekly.findWeeklyDiaryByWeekRange(user_id, string_of_week);
      if (!findDiary)
        return {
          msg: '해당 일자에 다이어리가 존재하지 않습니다',
          code: 'WDAR10002',
          result: findDiary,
        };
      return {
        msg: '해당 일자에 다이어리가 존재합니다',
        code: 'WDAR10001',
        result: findDiary,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `weeklyRead Error MSG ${error}`);
    }
  };
  public weeklyUpdate = async (weeklyDiary: CreateWeeklyDto) => {
    if (isEmpty(weeklyDiary))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const updateweeklyData = await this.weekly.updateWeeklyDiaryByDate(
        weeklyDiary,
      );
      if (!updateweeklyData)
        return {
          msg: '해당 일자에 다이어리를 수정 실패했습니다',
          code: 'WDAU10002',
          result: updateweeklyData,
        };
      return {
        msg: '해당 일자에 다이어리를 수정 성공했습니이',
        code: 'WDAU10001',
        result: updateweeklyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `weeklyUpdate Error MSG ${error}`);
    }
  };

  public weeklyDelete = async (
    string_of_week: string,
    number_of_week: number,
    user_id: number,
  ) => {
    if (isEmpty(number_of_week || string_of_week))
      throw new exceptError(400, `You didn't give weekly info`);
    try {
      const deleteCnt = await this.weekly.deleteWeeklyDiaryByDate(
        string_of_week,
        number_of_week,
        user_id,
      );
      if (!deleteCnt)
        return {
          msg: '해당 일자에 다이어리를 삭제 실패했습니다',
          code: 'WDAD10002',
          result: deleteCnt,
        };
      return {
        msg: '해당 일자에 다이어리를 삭제 성공했습니다',
        code: 'WDAD10001',
        result: deleteCnt,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `weeklyDelete Error MSG ${error}`);
    }
  };
}
