import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Stickers} from '../interface/stickers.interface';

export type StickersCreationAttributes = Optional<
  Stickers,
  | 'id'
  | 'user_id'
  | 'page_type'
  | 'page_date'
  | 'position'
  | 'size'
  | 'image'
  | 'image_name'
>;

export class StickersModel
  extends Model<Stickers, StickersCreationAttributes>
  implements Stickers
{
  public id!: number;
  public user_id!: number;
  public page_type!: string;
  public page_date!: string;
  public position!: Array<number>;
  public size!: Array<number>;
  public image!: string;
  public image_name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof StickersModel {
  StickersModel.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      page_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      page_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      position: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      size: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      image_name: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
    },
    {
      tableName: 'stickers',
      sequelize,
      indexes: [
        {
          name: 'stickers_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return StickersModel;
}
