import {Router} from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import {GetDailyDto} from '../dto/daily.dto';
import {authMiddleware} from '../middleware/auth.middleware';
import {SitckerController} from '../controller/sticker.controlller';
import {DeleteStickersDto, GetStickersDto} from '../dto/stickers.dto';
import multer from 'multer';
import {multerConfig} from '../config/multer';

// AWS.config.update(awsconfig);

class Sticker {
  public path = '/sticker';
  public router = Router();
  public stickersController = new SitckerController();
  public upload = multer(multerConfig);
  constructor() {
    this.router.get(
      `${this.path}/read/:type/:date`,
      authMiddleware,
      this.stickersController.getSticker,
    );
    this.router.post(
      `${this.path}/write`,
      this.upload.single('image'),
      authMiddleware,
      validationMiddleware(GetStickersDto, 'body'),
      this.stickersController.createSticker,
    );
    this.router.post(
      `${this.path}/update`,
      authMiddleware,
      validationMiddleware(GetStickersDto, 'body'),
      this.stickersController.updateSticker,
    );
    this.router.post(
      `${this.path}/delete`,
      authMiddleware,
      validationMiddleware(DeleteStickersDto, 'body'),
      this.stickersController.deleteSticker,
    );
  }
}

export default Sticker;
