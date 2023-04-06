import {NextFunction, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {DataStoredInToken, RequestWithUser} from '@/interface/auth.interface';
import models from '@/models/init-models';
import exceptError from '@/utils/excetpError';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const secretKey = 'tmp';
      const {id} = verify(Authorization, secretKey) as DataStoredInToken;
      const findUser = await models.Users.findOne({where: {id}});
      console.log(id);
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
