import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Pages} from '../interface/pages.interface';

export type PagesCreationAttributes = Optional<
  Pages,
  'id' | 'user_id' | 'date_range'
>;

export class PagesModel
  extends Model<Pages, PagesCreationAttributes>
  implements Pages
{
  public id!: number;
  public user_id!: number;
  public date_range!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof PagesModel {
  PagesModel.init(
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
      date_range: {
        type: DataTypes.RANGE(DataTypes.DATEONLY),
        allowNull: false,
        unique: 'pages_date_range_key',
      },
    },
    {
      tableName: 'pages',
      sequelize,
      indexes: [
        {
          name: 'pages_date_range_key',
          unique: true,
          fields: [{name: 'date_range'}],
        },
        {
          name: 'pages_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );
  return PagesModel;
}
