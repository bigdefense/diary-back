import {Request, Response, NextFunction} from 'express';

import {Users} from '../interface/users.interface';
import {UserService} from '../service/users.service';
import {RequestWithUser} from '../interface/auth.interface';

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
      const result = await this.userService.userSignUp(user);
      res.status(201).json({data: result, message: 'signup'});
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
        accessToken,
        refreshToken,
        findUser,
      }: {refreshToken: string; accessToken: string; findUser: Users} =
        await this.userService.userSignIn(email, password);
      res.cookie('Authorization', accessToken, {
        domain: '.mydiary.site',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 2,
      });

      res.cookie('Refresh', refreshToken, {
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
      res
        .status(200)
        .json({data: {findUser, accessToken, refreshToken}, message: 'login'});
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
      const logOutUserData: Users = await this.userService.userSignOut(
        email,
        password,
      );
      res.clearCookie('Authorization');
      res.clearCookie('Refresh');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.status(200).json({data: logOutUserData, message: 'logout'});
    } catch (error) {
      next(error);
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
