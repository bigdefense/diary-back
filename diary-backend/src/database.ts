import Sequelize from 'sequelize';
import {logger} from './utils/logger';

const sequelize = new Sequelize.Sequelize('postgres', 'root', 'root', {
  dialect: 'postgres',
  host: 'postgresql',
  port: 5432,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: true,
  logging: (query, time) => {
    logger.info(`[${time}ms] ${query}`);
  },
  benchmark: true,
});

sequelize.authenticate();

export default sequelize;
