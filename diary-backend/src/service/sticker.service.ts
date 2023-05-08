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
      if (existSticker)
        return {code: 'STK10002', msg: '스티커가 이미 존재합니다', result: {}};
      const createSticker: any = await this.sticker.createSticker(
        stickerData,
        s3Key,
      );
      return {
        code: 'STK10001',
        msg: '스티커를 생성했습니다',
        result: createSticker,
      };
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
      if (!findSticker || findSticker.length === 0)
        return {
          code: 'STK20002',
          msg: '스티커를 가져오는데 실패했습니다',
          result: {},
        };
      return {
        code: 'STK20001',
        msg: '해당일자의 스티커를 가지고왔습니다',
        result: findSticker,
      };
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `get All Sticker Error ${error}`);
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

  public stickerDelete = async (id: string) => {
    if (!id) throw new exceptError(400, `You didn't give sticker id`);
    try {
      const res: number = await this.sticker.deleteStickerBySid(id);
      if (res > 0) return {code: 'STK30001', msg: '스티커를 삭제했습니다'};
      return {code: 'STK30002', msg: '스티커를 삭제하지 못했습니다'};
    } catch (error) {
      logger.error(error);
      throw new exceptError(500, `delete Sticker Error ${error}`);
    }
  };
}
