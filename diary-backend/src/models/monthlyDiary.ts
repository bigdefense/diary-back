import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {MonthlyDiary} from '@/interface/monthlyDiary.interface';

export type MonthlyDiaryCreationAttributes = Optional<
  MonthlyDiary,
  'id' | 'user_id' | 'content' | 'date'
>;

export class MonthlyDiaryModel
  extends Model<MonthlyDiary, MonthlyDiaryCreationAttributes>
  implements MonthlyDiary
{
  public id!: number;
  public user_id!: number;
  public content!: Array<string>;
  public date!: string;

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
      content: {
        type: DataTypes.ARRAY(DataTypes.STRING(100)),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: 'monthly_diary',
      sequelize,
      indexes: [
        {
          name: 'monthly_diary_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return MonthlyDiaryModel;
}
