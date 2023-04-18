import {CreateMonthlyDto} from '../dto/monthly.dto';
import {MonthlyDiary} from '../interface/monthlyDiary.interface';
import models from '../models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '../utils/logger';
import sequelize from '../database';
import {Op, Transaction} from 'sequelize';
import exceptError from '../utils/excetpError';
import {getMonthRangeDate} from '../utils/getMonthRangeDay';

class MonthlyDao {
  public monthlys = models.MonthlyDiary;

  public async findMonthlyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<MonthlyDiary | null> {
    if (isEmpty(date)) throw new exceptError(400, `You didn't give Month Date`);
    const findMonthlyDiary: MonthlyDiary | null = await this.monthlys.findOne({
      where: {date, user_id},
    });
    return findMonthlyDiary;
  }

  public async findAllMonthlyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<Array<MonthlyDiary> | null> {
    if (isEmpty(date)) throw new exceptError(400, `You didn't give Month Date`);
    const [firstDate, lastDate]: string[] = getMonthRangeDate(date);
    const findAllMonthlyDiary: Array<MonthlyDiary> | null =
      await this.monthlys.findAll({
        where: {
          date: {[Op.between]: [firstDate, lastDate]},
          user_id,
        },
      });

    return findAllMonthlyDiary;
  }

  public async updateMonthlyDiaryByDate(
    monthlyDiaryData: CreateMonthlyDto,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findMonthlyDiary: MonthlyDiary | null = await this.monthlys.findOne(
        {
          where: {date: monthlyDiaryData.date},
        },
      );
      if (!findMonthlyDiary)
        throw new exceptError(400, `해당 날짜에는 글이 작성되지 않았습니다.`);
      const updateMonthlyDiary: [number] = await this.monthlys.update(
        {
          ...monthlyDiaryData,
        },
        {
          where: {
            date: monthlyDiaryData.date,
            user_id: monthlyDiaryData.user_id,
          },
        },
      );
      await transaction.commit();
      return updateMonthlyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async deleteMonthlyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<number | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findMonthlyDiary: MonthlyDiary | null = await this.monthlys.findOne(
        {
          where: {date, user_id},
        },
      );
      if (!findMonthlyDiary) throw new exceptError(400, `You are not user`);
      const deleteMonthlyDiary: number = await this.monthlys.destroy({
        where: {date, user_id},
      });
      await transaction.commit();
      return deleteMonthlyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async createMonthly(
    MonthlyData: CreateMonthlyDto,
  ): Promise<MonthlyDiary | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const createMonthlyData: MonthlyDiary = await this.monthlys.create(
        {
          ...MonthlyData,
        },
        {transaction: transaction},
      );
      await transaction.commit();
      return createMonthlyData;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }
}

export default MonthlyDao;
