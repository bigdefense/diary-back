import {IsString, Length, IsNumber, ArrayNotEmpty} from 'class-validator';

export class StickersDto {
  @IsNumber()
  public sticker_id!: number;

  @IsString()
  public page_type!: string;

  @IsString()
  public page_date!: string;

  @ArrayNotEmpty()
  public position!: Array<number>;

  @ArrayNotEmpty()
  public size!: Array<number>;

  @IsString()
  public image!: string;

  @Length(0, 4)
  public image_type!: string;

  @IsNumber()
  public priority!: number;
}
