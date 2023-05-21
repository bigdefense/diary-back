import {tokenSecret} from '@/config/cookie';
import {JwtToken} from '@/interface/auth.interface';
import {NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

export const tokenVerify = (token: string): JwtToken | void => {
  return verify(token, tokenSecret, (err, data) => {
    if (err?.name) return err.name;
    return data;
  });
};
