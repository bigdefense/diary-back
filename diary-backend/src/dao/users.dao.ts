import {hash} from 'bcrypt';
import {UserDto} from '../dto/users.dto';
import {Users} from '../interface/users.interface';
import models from '../models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '../utils/logger';
import sequelize from '../database';
import {Transaction} from 'sequelize';
import exceptError from '../utils/excetpError';

class UsersDao {
  public users = models.Users;

  public async findUserByEmail(email: string): Promise<Users | string> {
    try {
      if (isEmpty(email))
        throw new exceptError(400, `You didn't give userEmail`);
      const findUser: Users | null = await this.users.findOne({where: {email}});
      if (!findUser) return '유저가 존재하지 않습니다.';
      return findUser;
    } catch (e) {
      logger.error(e);
      throw new exceptError(400, `findUserByEmail error ${e}`);
    }
  }

  public async findUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    if (isEmpty(email) || isEmpty(password))
      throw new exceptError(400, `You didn't give userData`);
    const findUser: Users | null = await this.users.findOne({
      where: {email, password},
    });
    if (!findUser) throw new exceptError(400, `You are not user`);
    return findUser;
  }

  public async createUser(userData: UserDto): Promise<Users | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const hashedPassword = await hash(userData.password, 10);
      const createUserData: Users = await this.users.create(
        {
          ...userData,
          password: hashedPassword,
        },
        {transaction: transaction},
      );
      await transaction.commit();
      return createUserData;
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
      throw new exceptError(400, 'createUser error');
    }
  }
  public async refreshTokenSet(
    email: string,
    password: string,
    refreshStr: string,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await this.users.update(
        {
          refresh: refreshStr,
        },
        {where: {email: email, password: password}},
      );
      await transaction.commit();
    } catch (e) {
      logger.error(e);
      await transaction.rollback();
      throw new exceptError(400, 'refreshTokenSet error MSG: ${e}');
    }
  }
}

export default UsersDao;
