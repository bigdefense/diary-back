import {CreateDailyDto} from '../dto/daily.dto';
import {DailyDiary} from '../interface/dailyDiary.interface';
import models from '../models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '../utils/logger';
import sequelize from '../database';
import {Transaction} from 'sequelize';
import exceptError from '../utils/excetpError';

class DailyDao {
  public dailys = models.DailyDiary;

  public async findDailyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<DailyDiary | null> {
    if (isEmpty(date)) throw new exceptError(400, `You didn't give Daily Date`);
    const findDailyDiary: DailyDiary | null = await this.dailys.findOne({
      where: {date, user_id},
    });
    return findDailyDiary;
  }

  public async updateDailyDiaryByDate(
    dailyDate: CreateDailyDto,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findDailyDiary: DailyDiary | null = await this.dailys.findOne({
        where: {date: dailyDate.date},
      });
      if (!findDailyDiary) throw new exceptError(400, `You are not user`);
      const updateDailyDiary: [number] = await this.dailys.update(
        {
          ...dailyDate,
        },
        {where: {date: dailyDate.date, user_id: dailyDate.user_id}},
      );
      await transaction.commit();
      return updateDailyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async deleteDailyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<number | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findDailyDiary: DailyDiary | null = await this.dailys.findOne({
        where: {date},
      });
      if (!findDailyDiary) throw new exceptError(400, `You are not user`);
      const deleteDailyDiary: number = await this.dailys.destroy({
        where: {date, user_id},
      });
      await transaction.commit();
      return deleteDailyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async createDaily(
    dailyData: CreateDailyDto,
  ): Promise<DailyDiary | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const createDailyData: DailyDiary = await this.dailys.create(
        {
          ...dailyData,
        },
        {transaction: transaction},
      );
      await transaction.commit();
      return createDailyData;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }
}

export default DailyDao;
