import UsersDao from '../dao/users.dao';
import {DataStoredInToken, TokenData} from '../interface/auth.interface';
import {Users} from '../interface/users.interface';
import exceptError from '../utils/excetpError';
import {logger} from '../utils/logger';
import {compare} from 'bcrypt';
import {isEmpty} from 'class-validator';
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
    const {accessToken, refreshToken} = this.createToken(findUser);
    await this.user.refreshTokenSet(email, findUser.password, refreshToken);
    return {accessToken, refreshToken, findUser};
  };

  public async userSignOut(email: string, password: string): Promise<Users> {
    if (isEmpty(email) || isEmpty(password))
      throw new exceptError(400, "You're not userData");

    const findUser: Users = await this.user.findUserByEmailPassword(
      email,
      password,
    );
    if (!findUser) throw new exceptError(409, "You're not user");

    return findUser;
  }

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
    const dataStoredInToken: DataStoredInToken = {id: user.id};
    const tokens = {
      accessToken: sign({data: dataStoredInToken}, 'secret', {expiresIn: '1s'}),
      refreshToken: sign({}, 'secret', {expiresIn: '1d'}),
    };
    return tokens;
  }
}
