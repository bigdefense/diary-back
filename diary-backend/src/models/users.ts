import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Users} from '../interface/users.interface';

export type UsersCreationAttributes = Optional<
  Users,
  'id' | 'email' | 'password' | 'name' | 'image' | 'image_type'
>;

export class UsersModel
  extends Model<Users, UsersCreationAttributes>
  implements Users
{
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public image!: string;
  public image_type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UsersModel {
  UsersModel.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: 'users_email_key',
      },
      password: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(30),
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
    },
    {
      tableName: 'users',
      sequelize,
      indexes: [
        {
          name: 'users_email_key',
          unique: true,
          fields: [{name: 'email'}],
        },
        {
          name: 'users_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return UsersModel;
}
