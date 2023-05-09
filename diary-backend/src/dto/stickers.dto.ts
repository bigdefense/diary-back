import {
  IsString,
  IsNumber,
  ArrayNotEmpty,
  IsUUID,
  IsArray,
} from 'class-validator';

export class GetStickersDto {
  @IsUUID()
  public id!: number;

  @IsString()
  public page_type!: string;

  @IsString()
  public page_date!: string;

  @ArrayNotEmpty()
  public position!: Array<number>;

  @ArrayNotEmpty()
  public size!: Array<number>;

  public image!: string;

  @IsString()
  public image_name!: string;
}
export class DeleteStickersDto {
  @IsUUID()
  public id!: number;
}

export class CreateStickersDto {
  @IsUUID()
  public id!: number;

  @IsNumber()
  public user_id!: number;

  @IsString()
  public page_type!: string;

  @IsString()
  public page_date!: string;

  @ArrayNotEmpty()
  public position!: Array<number>;

  @ArrayNotEmpty()
  public size!: Array<number>;

  public image!: string;

  @IsString()
  public image_name!: string;
}

export class updateStickersDto {
  @IsUUID()
  public id!: number;

  @IsString()
  public page_type!: string;

  @IsString()
  public page_date!: string;

  @ArrayNotEmpty()
  public position!: Array<number>;

  @ArrayNotEmpty()
  public size!: Array<number>;

  public image!: string;

  @IsString()
  public image_name!: string;
}
