import {Router} from 'express';
import UsersController from '../controller/users.controller';
import validationMiddleware from '../middleware/validation.middleware';
import {UserDto} from '../dto/users.dto';
import {authMiddleware} from '../middleware/auth.middleware';

class Users {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();
  constructor() {
    this.router.get(
      `${this.path}/getprofile`,
      authMiddleware,
      validationMiddleware(UserDto, 'body'),
      this.usersController.getUserProfile,
    );
    this.router.get(
      `${this.path}/google/signup`,
      this.usersController.googleSignUp,
    );

    this.router.get(
      `${this.path}/google/signin`,
      this.usersController.googleSignIn,
    );

    this.router.get(
      `${this.path}/email-verify/:email_code/:userEmail`,
      this.usersController.getEmailVerify,
    );

    this.router.get(`${this.path}/refresh`, this.usersController.userRefresh);

    this.router.post(
      `${this.path}/updateprofile`,
      authMiddleware,
      validationMiddleware(UserDto, 'body'),
      this.usersController.updateUserProfile,
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
    // this.router.post(`${this.path}/email`, this.usersController.mailVerify);
  }
}

export default Users;
