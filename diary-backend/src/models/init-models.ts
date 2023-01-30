import Sequelize from 'sequelize';
import postsInitial from './posts';
import pagesInitial from './pages';
import stickersInitial from './stickers';
import usersInitial from './users';
import sequelize from '../database';

const Users = usersInitial(sequelize);
const Posts = postsInitial(sequelize);
const Pages = pagesInitial(sequelize);
const Stickers = stickersInitial(sequelize);

Pages.hasMany(Posts, {as: 'posts', foreignKey: 'page_id'});
Pages.hasMany(Stickers, {as: 'stickers', foreignKey: 'page_id'});
Pages.belongsTo(Users, {as: 'users', foreignKey: 'user_id'});
Posts.belongsTo(Pages, {as: 'pages', foreignKey: 'page_id'});
Stickers.belongsTo(Pages, {as: 'pages', foreignKey: 'page_id'});
Users.hasMany(Pages, {as: 'pages', foreignKey: 'user_id'});

const models = {
  Users,
  Posts,
  Pages,
  Stickers,
  sequelize,
  Sequelize,
};

export default models;
