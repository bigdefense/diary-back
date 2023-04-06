import {IsDate, IsDateString, IsNumber, IsString} from 'class-validator';

export class GetDailyDto {
  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDateString()
  public date!: string;
}

export class CreateDailyDto {
  @IsNumber()
  public user_id!: number;

  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDateString()
  public date!: string;
}
