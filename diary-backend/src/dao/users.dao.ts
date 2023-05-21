import {hash} from 'bcrypt';
import {UserDto} from '../dto/users.dto';
import models from '../models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '../utils/logger';
import sequelize from '../database';
import {Transaction} from 'sequelize';
import exceptError from '../utils/excetpError';
import {v4} from 'uuid';

class UsersDao {
  public users = models.Users;

  public async findUserById(id: number): Promise<UserDto | null> {
    try {
      const findUser: UserDto | null = await this.users.findOne({
        where: {id},
      });
      return findUser;
    } catch (e) {
      logger.error(e);
      throw new exceptError(400, `findUserBytoken error ${e}`);
    }
  }

  public async findUserByToken(refresh: string): Promise<UserDto | null> {
    try {
      const findUser: UserDto | null = await this.users.findOne({
        where: {refresh},
      });
      return findUser;
    } catch (e) {
      logger.error(e);
      throw new exceptError(400, `findUserBytoken error ${e}`);
    }
  }

  public async findUserByEmail(email: string): Promise<UserDto | null> {
    try {
      const findUser: UserDto | null = await this.users.findOne({
        where: {email},
      });
      return findUser;
    } catch (e) {
      logger.error(e);
      throw new exceptError(400, `findUserByEmail error ${e}`);
    }
  }
  public async setRefreshClear(id: number): Promise<UserDto> {
    try {
      const findUser = await this.users.findOne({
        where: {id},
      });
      if (!findUser) throw new exceptError(400, `You are not user`);
      findUser.refresh = '';
      findUser.save();
      return findUser;
    } catch (error) {
      logger.error(error);
      throw new exceptError(400, `findUserByEmailPassword error ${error}`);
    }
  }

  public async findUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<UserDto> {
    if (isEmpty(email) || isEmpty(password))
      throw new exceptError(400, `You didn't give userData`);
    const findUser: UserDto | null = await this.users.findOne({
      where: {email, password},
    });
    if (!findUser) throw new exceptError(400, `You are not user`);
    return findUser;
  }

  public async userEmailVerify(
    email: string,
    email_code: string,
  ): Promise<[number] | null> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const updateUserVerified: [number] = await this.users.update(
        {
          verified: true,
        },
        {where: {email, email_code}, transaction},
      );
      await transaction.commit();
      return updateUserVerified;
    } catch (error) {
      await transaction.rollback();
      logger.error(error);
      throw new exceptError(400, `userEmailVerify error ${error}`);
    }
  }

  public async createUser(userData: UserDto): Promise<UserDto> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userDataHashedPw: UserDto = {
        ...userData,
        password: await hash(userData.password, 10),
      };
      if (!userData.verified) userDataHashedPw.email_code = v4();
      const createUserData: UserDto = await this.users.create(
        userDataHashedPw,
        {transaction},
      );
      await transaction.commit();
      return createUserData;
    } catch (e) {
      await transaction.rollback();
      logger.error(e);
      throw new exceptError(400, 'createUser error');
    }
  }

  public async updateUser(userData: UserDto): Promise<UserDto> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await this.users.update(
        {
          ...userData,
        },
        {where: {id: userData.id}, transaction},
      );
      await transaction.commit();
      const updateResult = (await this.users.findOne({
        where: userData.id,
      })) as UserDto;
      return updateResult;
    } catch (e) {
      await transaction.rollback();
      logger.error(e);
      throw new exceptError(400, 'createUser error');
    }
  }
  public async refreshTokenSet(
    email: string,
    password: string,
    refreshStr: string,
  ): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await this.users.update(
        {
          refresh: refreshStr,
        },
        {where: {email: email, password: password}, transaction},
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
