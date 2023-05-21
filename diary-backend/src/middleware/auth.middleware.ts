import {NextFunction, Response} from 'express';
import {JwtToken, RequestWithUser} from '../interface/auth.interface';
import exceptError from '../utils/excetpError';
import {getCookie} from '@/utils/getCookie';
import {tokenVerify} from '@/utils/tokenVerify';

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getCookie(req, 'Authorization');
    if (!Authorization) throw new exceptError(401, `토큰 정보가 없습니다`);

    const isAccessExpired = tokenVerify(Authorization);

    if (typeof isAccessExpired === 'string')
      throw new exceptError(401, `Error: ${isAccessExpired}`);
    const {data} = isAccessExpired as JwtToken;
    req.user = {id: data.id};
    next();
  } catch (error) {
    next(error);
  }
};
