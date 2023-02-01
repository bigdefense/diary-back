import {Request} from 'express';
import {Users} from '@/interface/users.interface';

export interface DataStoredInToken {
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: Users;
}
