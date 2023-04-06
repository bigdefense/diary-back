import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {DailyDairy} from '../interface/dailyDairy.interface';

export type DailyDairyCreationAttributes = Optional<
  DailyDairy,
  'id' | 'user_id' | 'title' | 'content' | 'date'
>;

export class DailyDiaryModel
  extends Model<DailyDairy, DailyDairyCreationAttributes>
  implements DailyDairy
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
      tableName: 'daily_dairy',
      sequelize,
      indexes: [
        {
          name: 'daily_dairy_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return DailyDiaryModel;
}
