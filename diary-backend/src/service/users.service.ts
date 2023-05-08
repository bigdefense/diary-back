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
      const isDup = await this.userEmailDuplicate(user.email);
      if (isDup?.result) return isDup;
      const createUser = this.user.createUser(user);
      if (!createUser) return {msg: '회원가입에 실패했습니다.', code: 203};
      return {msg: '회원가입에 성공했습니다.', code: 200};
    } catch (error) {
      logger.error(error);
      throw new exceptError(400, `createUser error MSG:${error}`);
    }
  };

  public userSignIn = async (email: string, password: string) => {
    try {
      const isDup = await this.userEmailDuplicate(email);
      if (!isDup?.result)
        throw new exceptError(409, '해당 이메일로 가입된 유저가 없습니다');
      const findUser: Users = isDup.result;
      const match = await compare(password, findUser.password);
      if (!match) throw new exceptError(409, '비밀번호가 일치하지 않습니다');
      const {accessToken, refreshToken} = this.createToken(findUser);
      await this.user.refreshTokenSet(email, findUser.password, refreshToken);
      return {
        msg: '로그인 성공했습니다',
        code: 200,
        result: {accessToken, refreshToken},
      };
    } catch (error) {
      throw new exceptError(409, `signIn error MSG:${error}`);
    }
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
      const result: Users | null = await this.user.findUserByEmail(email);
      if (result)
        return {code: 200, msg: '해당 이메일로 가입된 유저가 있습니다', result};
      return {code: 200, msg: '해당 이메일로 가입된 유저는 없습니다', result};
    } catch (error) {
      logger.error(error);
      throw new exceptError(409, `userEmailDuplicate error MSG:${error}`);
    }
  };
  public createToken(user: Users): {accessToken: string; refreshToken: string} {
    const dataStoredInToken: DataStoredInToken = {id: user.id};
    const tokens = {
      accessToken: sign({data: dataStoredInToken}, 'secret', {expiresIn: '2h'}),
      refreshToken: sign({}, 'secret', {expiresIn: '1d'}),
    };
    return tokens;
  }
}
