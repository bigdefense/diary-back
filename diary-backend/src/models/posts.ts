import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import {Posts} from '../interface/posts.interface';

export type PostsCreationAttributes = Optional<
  Posts,
  'id' | 'page_id' | 'title' | 'content' | 'date' | 'priority'
>;

export class PostsModel
  extends Model<Posts, PostsCreationAttributes>
  implements Posts
{
  public id!: number;
  public page_id!: number;
  public title!: string;
  public content!: string;
  public date!: string;
  public priority!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof PostsModel {
  PostsModel.init(
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
      tableName: 'posts',
      sequelize,
      indexes: [
        {
          name: 'posts_pkey',
          unique: true,
          fields: [{name: 'id'}],
        },
      ],
    },
  );

  return PostsModel;
}
