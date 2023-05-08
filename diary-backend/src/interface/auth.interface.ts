import {Request} from 'express';
import {Users} from '../interface/users.interface';
export interface DataStoredInToken {
  id: number;
}

export interface JwtToken {
  data: {id: number};
  iat: number;
  exp: number;
}

export interface TokenData {
  accessToken?: string;
  refreshToken?: string;
}

export interface RequestWithUser extends Request {
  user: Users;
}

export interface RequestWithFile extends RequestWithUser {
  file: Express.Multer.File & Express.MulterS3.File;
}
