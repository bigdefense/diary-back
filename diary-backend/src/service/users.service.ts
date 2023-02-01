import UsersDao from '@/dao/users.dao';
import {UserDto} from '@/dto/users.dto';
import {DataStoredInToken, TokenData} from '@/interface/auth.interface';
import {Users} from '@/interface/users.interface';
import exceptError from '@/utils/excetpError';
import {logger} from '@/utils/logger';
import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';

export class UserService {
  public user = new UsersDao();

  public userSignUp = async (user: Users) => {
    try {
      await this.userEmailDuplicate(user.email);
      await this.user.createUser(user);
    } catch (error) {
      logger.error(error);
    }
  };

  public userSignIn = async (email: string, password: string) => {
    const findUser: Users = await this.user.findUserByEmail(email);
    if (!findUser)
      throw new exceptError(409, `You're email ${email} not found`);
    const match = await compare(password, findUser.password);
    if (!match) throw new exceptError(409, "You're password not matching");
    if (!match) logger.info("You're not user");
    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    return {cookie, findUser};
  };

  public userEmailDuplicate = async (email: string) => {
    try {
      const findUser: Users = await this.user.findUserByEmail(email);
      if (findUser) logger.info(`${409}, you're email ${email} already exists`);
      return findUser ? findUser : {};
    } catch (error) {
      logger.error(error);
    }
  };
  public createToken(user: Users): TokenData {
    const dataStoredInToken: DataStoredInToken = {email: user.email};
    const secretKey = 'tmp';
    const expiresIn: number = 60 * 60;
    return {expiresIn, token: sign(dataStoredInToken, secretKey, {expiresIn})};
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
