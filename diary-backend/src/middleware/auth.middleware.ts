import {NextFunction, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {DataStoredInToken, RequestWithUser} from '@/interface/auth.interface';
import models from '@/models/init-models';
import exceptError from '@/utils/excetpError';

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization') !== undefined
        ? req.header('Authorization')?.split('Bearer ')[1]
        : null);

    if (Authorization) {
      const secretKey = 'tmp';
      const verificationResponse = verify(
        Authorization,
        secretKey,
      ) as DataStoredInToken;
      const email = verificationResponse.email;
      const findUser = await models.Users.findOne({where: {email}});

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new exceptError(401, 'Wrong authentication token'));
      }
    } else {
      next(new exceptError(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new exceptError(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
