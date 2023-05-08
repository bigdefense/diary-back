import {Request, Response, NextFunction} from 'express';

import {Users} from '../interface/users.interface';
import {UserService} from '../service/users.service';
import {RequestWithUser, TokenData} from '../interface/auth.interface';
import exceptError from '@/utils/excetpError';

class UsersController {
  public userService = new UserService();

  public userPorfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {name, email, image} = req.user;
      res.status(200).json({user: {name, email, image}, message: 'profile'});
    } catch (error) {
      next(error);
    }
  };

  // 회원가입
  public userSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user: Users = req.body;
      const {msg, code} = await this.userService.userSignUp(user);
      res.status(code).json({msg, code});
    } catch (error) {
      next(error);
    }
  };

  // 로그인
  public userSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {email, password} = req.body;
      const {
        msg,
        code,
        result,
      }: {msg: string; code: number; result?: TokenData} =
        await this.userService.userSignIn(email, password);
      if (!result) res.status(203).json({msg, code, result});

      res.cookie('Authorization', result.accessToken, {
        domain: '.mydiary.site',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 2,
      });

      res.cookie('Refresh', result.refreshToken, {
        domain: '.mydiary.site',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(code).json({msg, code, result});
    } catch (error) {
      next(error);
    }
  };

  public userSignOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {email, password} = req.user;
      await this.userService.userSignOut(email, password);
      res.clearCookie('Authorization', {domain: '.mydiary.site'});
      res.clearCookie('Refresh', {domain: '.mydiary.site'});
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.status(200).json({msg: '로그아웃 되었습니다', code: 200});
    } catch (error) {
      next(error);
      throw new exceptError(500, '로그아웃 실패');
    }
  };

  // 이메일 중복체중
  public userEmailDup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {email} = req.body;
      const result = await this.userService.userEmailDuplicate(email);
      await res.send(result);
    } catch (error) {
      next(error);
    }
  };
  // public userRefresh = async (
  //   req: RequestWithUser,
  //   res: Response,
  //   next: NextFunction,
  // ) => {
  //   try {
  //     const {email, password} = req.user;
  //     const logOutUserData: Users = await this.userService.userSignOut(
  //       email,
  //       password,
  //     );
  //     res.setHeader('Set-Cookie', ['refresh=; Max-age=0']);
  //     res.setHeader(
  //       'Access-Control-Allow-Methods',
  //       'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  //     );
  //     res.status(200).json({data: logOutUserData, message: 'logout'});
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
export default UsersController;
