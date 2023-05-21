import {Request, Response, NextFunction} from 'express';

import {UserService} from '../service/users.service';
import {RequestWithUser, TokenData} from '../interface/auth.interface';
import exceptError from '@/utils/excetpError';
import {utilGoogle} from '@/utils/googleAtuh';
import {UserDto} from '@/dto/users.dto';
import {authCookie, refreshCookie} from '@/config/cookie';
import {logger} from '@/utils/logger';
import {OAUTH} from '@/config/oatuh';

class UsersController {
  public userService = new UserService();
  public google = new utilGoogle();

  public getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {msg, code, result} = await this.userService.getUserProfile(
        req.user.id,
      );
      res.status(200).json({result, msg, code});
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user: UserDto = req.body;
      const {msg, code, result} = await this.userService.updateUserProfile(
        req.user.id,
        user,
      );
      res.status(200).json({msg, code, result});
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public getEmailVerify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {email_code, userEmail} = req.params;
      console.log(email_code, userEmail);
      if (!email_code || !userEmail)
        new exceptError(400, 'code or userEmail 존재하지 않습니다 ');
      const {msg, code} = await this.userService.checkEmailVerify(
        userEmail as string,
        email_code as string,
      );
      res.redirect(`https://sej.mydiary.site/signin?%${code}`);
    } catch (error) {
      logger.error(error);
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
      const user: UserDto = req.body;
      const {msg, code} = await this.userService.userSignUp({
        ...user,
        verified: false,
        email_code: '',
      });
      res.status(200).json({msg, code});
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public googleSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const queryCode = req.query.code as string;
      // const pathUrl = (req.query.state as string) || '/';

      if (!queryCode) {
        return next(new exceptError(400, 'Authorization code not provided!'));
      }

      const {id_token, access_token} = await this.google.getGoogleOauthToken({
        code: queryCode,
        redirect_uri: OAUTH.GOOGLE_OAUTH_SIGNUP_URL,
      });

      const {name, verified_email, email, picture} =
        await this.google.getGoogleUser({
          id_token,
          access_token,
        });

      if (!verified_email) {
        return next(new exceptError(403, 'Google account not verified'));
      }
      const googleUser = new UserDto();
      googleUser.password = Math.random().toString(36).substr(2, 10);
      googleUser.image = picture;
      googleUser.name = name;
      googleUser.email = email;
      googleUser.image_type = 'google';
      googleUser.verified = verified_email;

      const {code} = await this.userService.userSignUp(googleUser);
      if (code === 'USD10001')
        res.redirect(`https://sej.mydiary.site/Signup?code=${code}`);
      res.redirect(`https://sej.mydiary.site/Login?code=${code}`);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public googleSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const queryCode = req.query.code as string;

      if (!queryCode) {
        return next(new exceptError(400, 'Authorization code not provided!'));
      }

      const {id_token, access_token} = await this.google.getGoogleOauthToken({
        code: queryCode,
        redirect_uri: OAUTH.GOOGLE_OAUTH_SIGNIN_URL,
      });

      const {verified_email, email} = await this.google.getGoogleUser({
        id_token,
        access_token,
      });

      if (!verified_email) {
        return next(new exceptError(403, 'Google account not verified'));
      }
      const {msg, code, result} = await this.userService.userSignIn(
        email,
        'google',
      );

      if (!result) await res.status(203).json({msg, code, result});
      const {accessToken, refreshToken} = result as TokenData;

      res.cookie('Authorization', accessToken, authCookie);
      res.cookie('Refresh', refreshToken, refreshCookie);
      res.redirect('https://sej.mydiary.site/Main');
    } catch (error) {
      logger.error(error);
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
      const user: UserDto = req.body;
      const {msg, code, result} = await this.userService.userSignIn(
        user.email,
        'email',
        user.password,
      );
      if (!result) await res.status(203).json({msg, code, result});
      const {accessToken, refreshToken} = result as TokenData;

      res.cookie('Authorization', accessToken, authCookie);
      res.cookie('Refresh', refreshToken, refreshCookie);
      res.status(200).json({msg, code, result});
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  public userSignOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.userSignOut(req.user.id);
      res.clearCookie('Authorization', {domain: '.mydiary.site'});
      res.clearCookie('Refresh', {domain: '.mydiary.site'});
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.status(200).json({msg: '로그아웃 되었습니다', code: 200});
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      next(error);
    }
  };
  public userRefresh = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const oldRefreshToken = req.cookies['Refresh'];
      const {msg, code, result} = await this.userService.refreshToken(
        oldRefreshToken,
      );
      const {accessToken, refreshToken} = result as TokenData;

      res.cookie('Authorization', accessToken, authCookie);
      res.cookie('Refresh', refreshToken, refreshCookie);
      res.status(200).json({msg, code, result});
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
export default UsersController;
