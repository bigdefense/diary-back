import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {DailyDiary} from '../interface/dailyDiary.interface';

export type DailyDiaryCreationAttributes = Optional<
  DailyDiary,
  'id' | 'user_id' | 'title' | 'content' | 'date'
>;

export class DailyDiaryModel
  extends Model<DailyDiary, DailyDiaryCreationAttributes>
  implements DailyDiary
{
  public id!: number;
  public user_id!: number;
  public title!: string;
  public content!: string;
  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof DailyDiaryModel {
  DailyDiaryModel.init(
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
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: 'daily_diary',
      sequelize,
      indexes: [
        {
          name: 'daily_diary_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return DailyDiaryModel;
}
