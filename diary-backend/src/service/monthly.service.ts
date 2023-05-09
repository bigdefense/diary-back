import MonthlyDao from '../dao/monthly.dao';
import {CreateMonthlyDto} from '../dto/monthly.dto';
import {MonthlyDiary} from '../interface/monthlyDiary.interface';
import exceptError from '../utils/excetpError';
import {logger} from '../utils/logger';
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
      if (existMonthly)
        return {
          msg: '내용이 이미 존재합니다.',
          code: 'MDADU10002',
          result: {},
        };
      const createMonthlyData = await this.Monthly.createMonthly(MonthlyDiary);
      if (!createMonthlyData)
        return {
          msg: '생성 실패',
          code: 'MDAC10002',
          result: {},
        };
      return {
        msg: '생성 성공',
        code: 'MDAC10001',
        result: createMonthlyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `MonthlyWrite Error MSG ${error}`);
    }
  };

  public MonthlyRead = async (MonthlyDate: string, user_id: number) => {
    if (isEmpty(MonthlyDate))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const findAllDiary: Array<MonthlyDiary> | null =
        await this.Monthly.findAllMonthlyDiaryByDate(MonthlyDate, user_id);
      if (!findAllDiary)
        return {
          msg: '조회 실패',
          code: 'MDAR10002',
          result: findAllDiary,
        };

      return {
        msg: '조회 성공',
        code: 'MDAR10001',
        result: findAllDiary,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `MonthlyRead Error MSG ${error}`);
    }
  };
  public MonthlyUpdate = async (MonthlyDiary: CreateMonthlyDto) => {
    if (isEmpty(MonthlyDiary))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const updateMonthlyData = await this.Monthly.updateMonthlyDiaryByDate(
        MonthlyDiary,
      );
      if (!updateMonthlyData)
        return {
          msg: '수정 실패',
          code: 'MDAU10002',
          result: {},
        };
      return {
        msg: '수정 성공',
        code: 'MDAU10001',
        result: updateMonthlyData,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `MonthlyUpdate Error MSG ${error}`);
    }
  };

  public MonthlyDelete = async (MonthlyDate: string, user_id: number) => {
    if (isEmpty(MonthlyDate))
      throw new exceptError(400, `You didn't give Monthly info`);
    try {
      const deleteCnt = await this.Monthly.deleteMonthlyDiaryByDate(
        MonthlyDate,
        user_id,
      );
      if (!deleteCnt)
        return {
          msg: '삭제 실패',
          code: 'MDAR10002',
          result: {},
        };
      return {
        msg: '삭제 성공',
        code: 'MDAR10001',
        result: deleteCnt,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `MonthlyDelete Error MSG ${error}`);
    }
  };
}
