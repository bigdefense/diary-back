import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Users} from '../interface/users.interface';

export type UsersCreationAttributes = Optional<
  Users,
  | 'id'
  | 'email'
  | 'password'
  | 'name'
  | 'image'
  | 'image_type'
  | 'refresh'
  | 'email_code'
  | 'verified'
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
  public refresh!: string;
  public email_code!: string;
  public verified!: boolean;

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
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: 'users_email_key',
      },
      password: {
        type: DataTypes.STRING(100),
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
      refresh: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      email_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
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
