import models from '../models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '../utils/logger';
import sequelize from '../database';
import {Op, Transaction} from 'sequelize';
import exceptError from '../utils/excetpError';
import {WeeklyDiary} from '@/interface/weeklyDiary.interface';
import {getWeekRange} from '@/utils/getDateOfString';
import {CreateWeeklyDto} from '@/dto/weekly.dto';

class WeeklyDao {
  public Weeklys = models.WeeklyDiary;

  public async findWeeklyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<WeeklyDiary | null> {
    if (isEmpty(date))
      throw new exceptError(400, `You didn't give Weekly Date`);
    const findWeeklyDiary: WeeklyDiary | null = await this.Weeklys.findOne({
      where: {date, user_id},
    });
    return findWeeklyDiary;
  }

  public async findWeeklyDiaryByWeekRange(
    date: string,
    user_id: number,
  ): Promise<WeeklyDiary[] | null> {
    if (isEmpty(date))
      throw new exceptError(400, `You didn't give Weekly Date`);
    const [firstDayStr, lastDayStr] = getWeekRange(date);
    const findWeeklyDiary: WeeklyDiary[] | null = await this.Weeklys.findAll({
      where: {
        date: {
          [Op.between]: [firstDayStr, lastDayStr],
        },
        user_id,
      },
    });
    return findWeeklyDiary;
  }

  public async updateWeeklyDiaryByDate(
    WeeklyDate: CreateWeeklyDto,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findWeeklyDiary: WeeklyDiary | null = await this.Weeklys.findOne({
        where: {date: WeeklyDate.date},
      });
      if (!findWeeklyDiary) throw new exceptError(400, `You are not user`);
      const updateWeeklyDiary: [number] = await this.Weeklys.update(
        {
          ...WeeklyDate,
        },
        {where: {date: WeeklyDate.date, user_id: WeeklyDate.user_id}},
      );
      await transaction.commit();
      return updateWeeklyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async deleteWeeklyDiaryByDate(
    date: string,
    user_id: number,
  ): Promise<number | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findWeeklyDiary: WeeklyDiary | null = await this.Weeklys.findOne({
        where: {date},
      });
      if (!findWeeklyDiary) throw new exceptError(400, `You are not user`);
      const deleteWeeklyDiary: number = await this.Weeklys.destroy({
        where: {date, user_id},
      });
      await transaction.commit();
      return deleteWeeklyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async createWeekly(
    WeeklyData: CreateWeeklyDto,
  ): Promise<WeeklyDiary | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const createWeeklyData: WeeklyDiary = await this.Weeklys.create(
        {
          ...WeeklyData,
        },
        {transaction: transaction},
      );
      await transaction.commit();
      return createWeeklyData;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }
}

export default WeeklyDao;
