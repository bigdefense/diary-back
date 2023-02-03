import {hash} from 'bcrypt';
import {UserDto} from '@/dto/users.dto';
import {Users} from '@/interface/users.interface';
import models from '@/models/init-models';
import {isEmpty} from 'class-validator';
import {logger} from '@/utils/logger';
import sequelize from '@/database';
import {Transaction} from 'sequelize';
import exceptError from '@/utils/excetpError';

class UsersDao {
  public users = models.Users;

  public async findUserByEmail(email: string): Promise<Users> {
    if (isEmpty(email)) throw new exceptError(400, `You didn't give userEmail`);
    const findUser: Users | null = await this.users.findOne({where: {email}});
    if (!findUser) throw new exceptError(400, `You are not user`);
    return findUser;
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
    }
  }
}

export default UsersDao;
