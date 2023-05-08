import {Users} from '../../interface/users.interface';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: Users;
      file: Express.Multer.File & Express.MulterS3.File;
    }
  }
}
