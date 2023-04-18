import {IsString, Length, IsNumber, ArrayNotEmpty} from 'class-validator';

export class GetStickersDto {
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
}

export class CreateGetStickersDto {
  @IsNumber()
  public user_id!: number;

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
}
