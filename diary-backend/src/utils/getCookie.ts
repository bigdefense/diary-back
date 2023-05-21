import {RequestWithUser} from '@/interface/auth.interface';

export const getCookie = (req: RequestWithUser, str: string) => {
  const coockie = req.cookies[str];
  if (coockie) return coockie;

  const header = req.header(str);
  if (header) return header.split('Bearer')[1];

  return null;
};
