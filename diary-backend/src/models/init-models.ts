import Sequelize from 'sequelize';
import stickersInitial from './stickers';
import usersInitial from './users';
import monthlyInitial from './monthlyDiary';
import weeklyInitial from './weeklyDiary';
import dailyInitial from './dailyDiary';
import sequelize from '../database';

const Users = usersInitial(sequelize);
const MonthlyDiary = monthlyInitial(sequelize);
const DailyDiary = dailyInitial(sequelize);
const WeeklyDiary = weeklyInitial(sequelize);
const Stickers = stickersInitial(sequelize);

Users.hasMany(MonthlyDiary, {as: 'monthly_dairy', foreignKey: 'user_id'});
Users.hasMany(WeeklyDiary, {as: 'weekly_dairy', foreignKey: 'user_id'});
Users.hasMany(DailyDiary, {as: 'daily_dairy', foreignKey: 'user_id'});
Users.hasMany(Stickers, {as: 'stickers', foreignKey: 'user_id'});

Stickers.belongsTo(Users, {as: 'users', foreignKey: 'user_id'});
MonthlyDiary.belongsTo(Users, {as: 'users', foreignKey: 'user_id'});
WeeklyDiary.belongsTo(Users, {as: 'users', foreignKey: 'user_id'});
DailyDiary.belongsTo(Users, {as: 'users', foreignKey: 'user_id'});

const models = {
  Users,
  Stickers,
  MonthlyDiary,
  DailyDiary,
  WeeklyDiary,
  sequelize,
  Sequelize,
};

export default models;
