import {createDailyDto} from '@/dto/daily.dto';
import {DailyDairy} from '@/interface/dailyDairy.interface';
import models from '@/models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '@/utils/logger';
import sequelize from '@/database';
import {Transaction} from 'sequelize';
import exceptError from '@/utils/excetpError';

class DailyDao {
  public dailys = models.DailyDiary;

  public async findDailyDairyByDate(
    date: string,
    user_id: number,
  ): Promise<DailyDairy> {
    if (isEmpty(date)) throw new exceptError(400, `You didn't give Daily Date`);
    const findDailyDairy: DailyDairy | null = await this.dailys.findOne({
      where: {date, user_id},
    });
    if (!findDailyDairy) throw new exceptError(400, `You are not user`);
    return findDailyDairy;
  }

  public async updateDailyDairyByDate(
    dailyDate: createDailyDto,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findDailyDairy: DailyDairy | null = await this.dailys.findOne({
        where: {date: dailyDate.date},
      });
      if (!findDailyDairy) throw new exceptError(400, `You are not user`);
      const updateDailyDairy: [number] = await this.dailys.update(
        {
          ...dailyDate,
        },
        {where: {date: dailyDate.date, user_id: dailyDate.user_id}},
      );
      await transaction.commit();
      return updateDailyDairy;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async deleteDailyDairyByDate(
    date: string,
    user_id: number,
  ): Promise<number | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findDailyDairy: DailyDairy | null = await this.dailys.findOne({
        where: {date},
      });
      if (!findDailyDairy) throw new exceptError(400, `You are not user`);
      const deleteDailyDairy: number = await this.dailys.destroy({
        where: {date, user_id},
      });
      await transaction.commit();
      return deleteDailyDairy;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async createDaily(
    dailyData: createDailyDto,
  ): Promise<DailyDairy | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const createDailyData: DailyDairy = await this.dailys.create(
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
