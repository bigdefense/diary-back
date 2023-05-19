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
    user_id: number,
    string_of_week: string,
    number_of_week: number,
  ): Promise<WeeklyDiary | null> {
    if (isEmpty(number_of_week || string_of_week))
      throw new exceptError(400, `You didn't give Weekly Date`);
    const findWeeklyDiary: WeeklyDiary | null = await this.Weeklys.findOne({
      where: {user_id, string_of_week, number_of_week},
    });
    return findWeeklyDiary;
  }

  public async findWeeklyDiaryByWeekRange(
    user_id: number,
    string_of_week: string,
  ): Promise<WeeklyDiary[] | null> {
    if (isEmpty(string_of_week))
      throw new exceptError(400, `You didn't give Weekly Date`);
    console.log(string_of_week);
    const findWeeklyDiary: WeeklyDiary[] | null = await this.Weeklys.findAll({
      where: {
        string_of_week,
        number_of_week: {
          [Op.between]: [0, 7],
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
        where: {
          string_of_week: WeeklyDate.string_of_week,
          number_of_week: WeeklyDate.number_of_week,
          user_id: WeeklyDate.user_id,
        },
      });
      if (!findWeeklyDiary) throw new exceptError(400, `You are not user`);
      const updateWeeklyDiary: [number] = await this.Weeklys.update(
        {
          ...WeeklyDate,
        },
        {
          where: {
            string_of_week: WeeklyDate.string_of_week,
            number_of_week: WeeklyDate.number_of_week,
            user_id: WeeklyDate.user_id,
          },
        },
      );
      await transaction.commit();
      return updateWeeklyDiary;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
    }
  }

  public async deleteWeeklyDiaryByDate(
    string_of_week: string,
    number_of_week: number,
    user_id: number,
  ): Promise<number | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findWeeklyDiary: WeeklyDiary | null = await this.Weeklys.findOne({
        where: {
          string_of_week,
          number_of_week,
          user_id,
        },
      });
      if (!findWeeklyDiary) throw new exceptError(400, `You are not user`);
      const deleteWeeklyDiary: number = await this.Weeklys.destroy({
        where: {
          string_of_week,
          number_of_week,
          user_id,
        },
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
