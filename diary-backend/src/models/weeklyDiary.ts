import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {WeeklyDiary} from '../interface/weeklyDiary.interface';

export type MonthlyDiaryCreationAttributes = Optional<
  WeeklyDiary,
  'id' | 'user_id' | 'content' | 'date' | 'string_of_week' | 'number_of_week'
>;

export class WeeklyDiaryModel
  extends Model<WeeklyDiary, MonthlyDiaryCreationAttributes>
  implements WeeklyDiary
{
  public id!: number;
  public user_id!: number;
  public title!: string;
  public content!: string;
  public date!: string;
  public string_of_week!: string;
  public number_of_week!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof WeeklyDiaryModel {
  WeeklyDiaryModel.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      string_of_week: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      number_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'weekly_diary',
      sequelize,
      indexes: [
        {
          name: 'weekly_diary_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return WeeklyDiaryModel;
}
