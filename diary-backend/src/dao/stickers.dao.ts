import {Stickers} from '@/interface/stickers.interface';
import models from '../models/init-models';
import {logger} from '@/utils/logger';
import {Op, Transaction} from 'sequelize';
import sequelize from '../database';
import {CreateStickersDto} from '@/dto/stickers.dto';
import {myS3} from '@/config/multer';
import {DeleteObjectCommand} from '@aws-sdk/client-s3';
import exceptError from '@/utils/excetpError';

export class StickersDao {
  public stikcers = models.Stickers;

  public async findStickerBySId(id: number): Promise<Stickers | null> {
    return await this.stikcers.findOne({
      where: {id},
    });
  }
  public async findAllStickerByIdWithMonth(
    user_id: number,
    page_type: string,
    page_date: string,
  ): Promise<Array<Stickers> | null> {
    try {
      return await this.stikcers.findAll({
        where: {user_id, page_type, page_date},
      });
    } catch (error) {
      throw new exceptError(
        500,
        `findAllStickerByIdWithMonth Error MSG:${error}`,
      );
    }
  }

  public async findAllStickerByIdWithWeekly(
    user_id: number,
    page_type: string,
    page_date: Array<string>,
  ): Promise<Array<Stickers> | null> {
    try {
      const [firstDayStr, lastDayStr] = page_date;
      return await this.stikcers.findAll({
        where: {
          user_id,
          page_type,
          page_date: {
            [Op.between]: [firstDayStr, lastDayStr],
          },
        },
      });
    } catch (error) {
      throw new exceptError(
        500,
        `findAllStickerByIdWithWeekly Error MSG:${error}`,
      );
    }
  }

  public async findAllStickerById(
    user_id: number,
    page_type: string,
    page_date: string,
  ): Promise<Array<Stickers> | null> {
    try {
      return await this.stikcers.findAll({
        where: {user_id, page_type, page_date},
      });
    } catch (error) {
      throw new exceptError(500, `findAllStickerById Error MSG:${error}`);
    }
  }

  public async createSticker(
    stickerData: CreateStickersDto,
    s3Key: string,
  ): Promise<Stickers | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const createStickerData: Stickers = await this.stikcers.create(
        {
          ...stickerData,
        },
        {transaction},
      );
      if (!createStickerData) throw new exceptError(400, '스티커 생성 실패');
      await transaction.commit();
      return createStickerData;
    } catch (err) {
      myS3.send(
        new DeleteObjectCommand({Bucket: 'mydiary-iamges', Key: s3Key}),
      );
      await transaction.rollback();
      throw new exceptError(500, `createSticker Error MSG:${err}`);
    }
  }

  public async updateStickerBySid(
    stickerData: CreateStickersDto,
  ): Promise<[number] | void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findSticker: Stickers | null = await this.stikcers.findOne({
        where: {id: stickerData.id},
      });
      if (!findSticker) throw new Error('해당스티커가 없습니다');
      const updateSticker: [number] = await this.stikcers.update(
        {
          ...stickerData,
        },
        {
          where: {
            id: stickerData.id,
          },
          transaction,
        },
      );
      await transaction.commit();
      return updateSticker;
    } catch (err) {
      logger.error(err);
      await transaction.rollback();
    }
  }

  public async deleteStickerBySid(id: string): Promise<number> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const findSticker: Stickers | null = await this.stikcers.findOne({
        where: {id},
      });
      if (!findSticker) throw new Error('해당스티커가 없습니다');
      const deleteSticker: number = await this.stikcers.destroy({
        where: {id},
        transaction,
      });
      await transaction.commit();
      myS3.send(
        new DeleteObjectCommand({
          Bucket: 'mydiary-iamges',
          Key: findSticker.image_name,
        }),
      );
      return deleteSticker;
    } catch (err) {
      logger.error(err);
      await transaction.rollback();
      throw new exceptError(500, `deleteStickerBySid Error MSG:${err}`);
    }
  }
}
