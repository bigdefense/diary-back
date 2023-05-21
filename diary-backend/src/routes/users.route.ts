import {Router} from 'express';
import UsersController from '../controller/users.controller';
import validationMiddleware from '../middleware/validation.middleware';
import {GetUserDto, UserDto} from '../dto/users.dto';
import {authMiddleware} from '../middleware/auth.middleware';

class Users {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();
  constructor() {
    this.router.get(
      `${this.path}/profile`,
      authMiddleware,
      validationMiddleware(UserDto, 'body'),
      this.usersController.getUserPorfile,
    );
    this.router.get(
      `${this.path}/oauth/google`,
      this.usersController.googleSignUp,
    );
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(UserDto, 'body'),
      this.usersController.userSignUp,
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(UserDto, 'body'),
      this.usersController.userSignIn,
    );
    this.router.post(
      `${this.path}/signout`,
      authMiddleware,
      this.usersController.userSignOut,
    );
    this.router.get(
      `${this.path}/email-verify/:email_code/:userEmail`,
      this.usersController.getEmailVerify,
    );
    // this.router.post(`${this.path}/email`, this.usersController.mailVerify);
  }
}

export default Users;
