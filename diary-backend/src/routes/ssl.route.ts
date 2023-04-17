import {Router} from 'express';
import sslController from '../controller/ssl.controller';

const fileName = '59F4AC7AC34FB82BC5CCE78D79BBA4F6.txt';
class SSL {
  public path = '/.well-known';
  public router = Router();
  public sslController = new sslController();
  constructor() {
    this.router.get(
      `${this.path}/pki-validation/${fileName}`,
      this.sslController.pkiValidation,
    );
  }
}

export default SSL;
