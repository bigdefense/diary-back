import {NextFunction, Response} from 'express';
import {DailyDiary} from '../interface/dailyDiary.interface';
import {RequestWithFile, RequestWithUser} from '../interface/auth.interface';
import {StikcerService} from '../service/sticker.service';
import {CreateStickersDto, GetStickersDto} from '../dto/stickers.dto';
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

      res.status(code).json({msg, code, result});
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
        createData.page_date = getMonthFirstDay(req.body.page_date);

      const createStickerData: DailyDiary = await this.sticker.stickerCreate(
        createData,
        s3Key,
      );

      res.status(201).json({data: createStickerData, message: 'created'});
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
      const getStickerData: GetStickersDto = req.body;
      const createData: CreateStickersDto = {
        user_id: Number(req.user.id),
        ...getStickerData,
      };
      const updateStickerData: any = await this.sticker.stickerUpdate(
        createData,
      );
      res.status(200).json({data: updateStickerData, message: 'updated'});
    } catch (error) {
      next(error);
    }
  };

  public deleteDaily = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {id} = req.body;
      const deleteDailyData: any = await this.sticker.stickerDelete(id);

      res.status(200).json({data: deleteDailyData, message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
