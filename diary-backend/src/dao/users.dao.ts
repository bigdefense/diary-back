import {hash} from 'bcrypt';
import {createUserDto} from '@/dto/users.dto';
import {Users} from '@/interface/users.interface';
import models from '@/models/init-models';
import {isEmpty} from 'class-validator';
import {Transaction} from 'sequelize';

class UsersDao {
  public users = models.Users;

  public async findUserById(userId: string): Promise<Users> {
    if (isEmpty(userId)) throw new Error(`${400}You are not userId`);
    const findUser: Users | null = await this.users.findByPk(userId);
    if (!findUser) throw new Error(`${400}You are not user`);
    return findUser;
  }

  public async createUser(userData: createUserDto): Promise<Users> {
    if (isEmpty(userData)) throw new Error(`${400}You're not userData`);

    const findUser: Users | null = await this.users.findOne({
      where: {email: userData.email},
    });
    if (findUser)
      throw new Error(`${409}, you're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: Users = await this.users.create({
      ...userData,
      password: hashedPassword,
    });
    return createUserData;
  }
}

export default UsersDao;
