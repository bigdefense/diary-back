import {NextFunction, Response} from 'express';
import {RequestWithFile, RequestWithUser} from '../interface/auth.interface';
import {StikcerService} from '../service/sticker.service';
import {
  CreateStickersDto,
  GetStickersDto,
  UpdateStickersDto,
} from '../dto/stickers.dto';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import {myS3} from '@/config/multer';
import {getMonthFirstDay} from '@/utils/getDateOfString';
import exceptError from '@/utils/excetpError';

export class SitckerController {
  public sticker = new StikcerService();

  public getSticker = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user_id = Number(req.user.id);
      const page_tpye = req.params.type;
      const page_date = req.params.date;
      const {msg, code, result} = await this.sticker.stickerAllGet(
        user_id,
        page_tpye,
        page_date,
      );

      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
      throw new exceptError(500, `getSticker error ${error}`);
    }
  };

  public createSticker = async (
    req: RequestWithFile,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // console.log(req.body);
      // console.log(req.file);
      if (!req.file) throw new Error('file is not exist');

      const getStickerData: GetStickersDto = req.body;
      const s3Key = req.file.key;
      const createData: CreateStickersDto = {
        ...getStickerData,
        user_id: Number(req.user.id),
        image: req.file.location,
        image_name: req.file.key,
      };

      if (req.body.page_type === 'monthly')
        createData.page_date = await getMonthFirstDay(req.body.page_date);

      const createRes = await this.sticker.stickerCreate(createData, s3Key);

      res.status(200).json({
        msg: createRes?.msg,
        code: createRes?.code,
        result: createRes?.result,
      });
    } catch (error) {
      myS3.send(
        new DeleteObjectCommand({Bucket: 'mydiary-iamges', Key: req.file.key}),
      );
      next(error);
    }
  };

  public updateSticker = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getStickerData: UpdateStickersDto = req.body;
      const createData: CreateStickersDto = {
        user_id: Number(req.user.id),
        ...getStickerData,
      };
      const {msg, code, result} = await this.sticker.stickerUpdate(createData);
      res.status(200).json({msg, code, result});
    } catch (error) {
      next(error);
      throw new exceptError(500, `updateSticker error ${error}`);
    }
  };

  public deleteSticker = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.body;
      console.log('==================================');
      console.log(req.body);
      const {code, msg}: {code: string; msg: string} =
        await this.sticker.stickerDelete(id);

      res.status(200).json({msg, code, message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
