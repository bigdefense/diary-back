import {Request, Response, NextFunction} from 'express';

import {Users} from '@/interface/users.interface';
import {UserService} from '@/service/users.service';
import {RequestWithUser} from '@/interface/auth.interface';

class UsersController {
  public userService = new UserService();
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
      const {cookie, findUser}: {cookie: string; findUser: Users} =
        await this.userService.userSignIn(email, password);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({data: findUser, message: 'login'});
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
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
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
}
export default UsersController;
