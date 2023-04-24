import {Router} from 'express';
import sslController from '../controller/ssl.controller';

const fileName = 'FEB1092FBA22840526B86DE33A14908D.txt';
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
