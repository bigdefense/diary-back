import {NextFunction, Response} from 'express';
import {verify, sign, decode} from 'jsonwebtoken';
import {JwtToken, RequestWithUser} from '../interface/auth.interface';
import models from '../models/init-models';
import exceptError from '../utils/excetpError';
import f from 'session-file-store';

const secretKey = 'secret';

const getCookie = (req: RequestWithUser, str: string) => {
  const coockie = req.cookies[str];
  if (coockie) return coockie;

  const header = req.header(str);
  if (header) return header.split('Bearer')[1];

  return null;
};

const tokenVerify = (token: string, next: NextFunction): JwtToken | void => {
  return verify(token, secretKey, (err, data) => {
    if (!err) return false;
    if (err.name === 'TokenExpiredError') return true;
  });
};

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getCookie(req, 'Authorization');
    const Refresh = getCookie(req, 'Refresh');
    if (!Authorization)
      return next(new exceptError(404, 'AccessToken이 없습니다!'));

    const isAccessExpired = tokenVerify(Authorization, next);
    const isRefreshExpired = tokenVerify(Refresh, next);
    const accessData = decode(Authorization) as JwtToken;
    const {id} = accessData.data;
    const findUser = await models.Users.findOne({where: {id}});
    if (!findUser)
      return next(new exceptError(401, '유효하지 않은 사용자입니다'));

    if (isAccessExpired && isRefreshExpired)
      return next(new exceptError(401, 'API 사용권한이 없습니다!'));

    if (isAccessExpired && !isRefreshExpired) {
      if (findUser.refresh !== Refresh)
        return next(new exceptError(401, 'Refresh Token이 유효하지 않습니다'));

      const newAccessToken = sign({data: {id}}, secretKey, {expiresIn: '1h'});
      res.cookie('Authorization', newAccessToken);
      req.cookies.Authorization = newAccessToken;
      req.user = findUser;
      next();
    }
    if (!isAccessExpired && isRefreshExpired) {
      const newRefreshToken = sign({}, secretKey, {expiresIn: '1d'});
      findUser.refresh = newRefreshToken;
      findUser.save();

      res.cookie('Refresh', newRefreshToken);
      req.cookies.Refresh = newRefreshToken;
      req.user = findUser;
      next();
    }
    if (!isAccessExpired && !isRefreshExpired) {
      req.user = findUser;
      next();
    }
  } catch (error) {
    next(new exceptError(401, JSON.stringify(error)));
  }
};
