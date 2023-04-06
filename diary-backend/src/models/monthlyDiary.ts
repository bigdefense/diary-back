import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {MonthlyDairy} from '../interface/monthlyDairy.interface';

export type MonthlyDairyCreationAttributes = Optional<
  MonthlyDairy,
  'id' | 'user_id' | 'title' | 'content' | 'date'
>;

export class MonthlyDiaryModel
  extends Model<MonthlyDairy, MonthlyDairyCreationAttributes>
  implements MonthlyDairy
{
  public id!: number;
  public user_id!: number;
  public title!: string;
  public content!: string;
  public date!: string;
  public priority!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof MonthlyDiaryModel {
  MonthlyDiaryModel.init(
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
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'monthly_dairy',
      sequelize,
      indexes: [
        {
          name: 'monthly_dairy_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return MonthlyDiaryModel;
}
