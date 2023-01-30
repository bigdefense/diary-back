import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Stickers} from '../interface/stickers.interface';

export type StickersCreationAttributes = Optional<
  Stickers,
  'id' | 'page_id' | 'position' | 'size' | 'image' | 'priority'
>;

export class StickersModel
  extends Model<Stickers, StickersCreationAttributes>
  implements Stickers
{
  public id!: number;
  public page_id!: number;
  public position!: Array<number>;
  public size!: Array<number>;
  public image!: string;
  public image_type!: string;
  public priority!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof StickersModel {
  StickersModel.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      page_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pages',
          key: 'id',
        },
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
        type: DataTypes.BLOB,
        allowNull: true,
      },
      image_type: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      priority: {
        type: DataTypes.INTEGER,
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