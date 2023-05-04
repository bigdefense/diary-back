import {StickersDao} from '@/dao/stickers.dao';
import {CreateStickersDto} from '@/dto/stickers.dto';
import exceptError from '../utils/excetpError';
import {logger} from '../utils/logger';
import {isEmpty} from 'class-validator';
import {Stickers} from '@/interface/stickers.interface';
import {myS3} from '@/config/multer';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import {getMonthFirstDay, getWeekRange} from '@/utils/getDateOfString';

export class StikcerService {
  public sticker = new StickersDao();

  public stickerCreate = async (
    stickerData: CreateStickersDto,
    s3Key: string,
  ) => {
    if (isEmpty(stickerData))
      throw new exceptError(400, `You didn't give sticker info`);
    try {
      const existSticker = await this.sticker.findStickerBySId(stickerData.id);
      if (existSticker) throw new exceptError(409, '스티커가 이미 존재합니다');
      const createSticker: any = await this.sticker.createSticker(
        stickerData,
        s3Key,
      );
      return createSticker;
    } catch (error) {
      logger.error(error);
      myS3.send(
        new DeleteObjectCommand({Bucket: 'mydiary-iamges', Key: s3Key}),
      );
    }
  };

  public stickerAllGet = async (
    user_id: number,
    page_type: string,
    page_date: string,
  ) => {
    if (isEmpty(user_id))
      throw new exceptError(400, `You didn't give user_id info`);
    try {
      let findSticker: Array<Stickers> | null = null;
      if (page_type === 'monthly') {
        const monthFirstDay = getMonthFirstDay(page_date);
        findSticker = await this.sticker.findAllStickerByIdWithMonth(
          user_id,
          page_type,
          monthFirstDay,
        );
      }
      if (page_type === 'weekly') {
        const weekRange = getWeekRange(page_date);
        findSticker = await this.sticker.findAllStickerByIdWithWeekly(
          user_id,
          page_type,
          weekRange,
        );
      }
      if (page_type === 'daily')
        findSticker = await this.sticker.findAllStickerById(
          user_id,
          page_type,
          page_date,
        );
      return findSticker;
    } catch (error) {
      logger.error(error);
    }
  };
  public stickerUpdate = async (stickerData: CreateStickersDto) => {
    if (isEmpty(stickerData))
      throw new exceptError(400, `You didn't give sticker info`);
    try {
      const updateSticker = await this.sticker.updateStickerBySid(stickerData);
      return updateSticker;
    } catch (error) {
      logger.error(error);
    }
  };

  public stickerDelete = async (id: number) => {
    if (isEmpty(id)) throw new exceptError(400, `You didn't give sticker id`);
    try {
      await this.sticker.deleteStickerBySid(id);
    } catch (error) {
      logger.error(error);
    }
  };
}
