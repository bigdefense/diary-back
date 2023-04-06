import {IsDate, IsDateString, IsNumber, IsString} from 'class-validator';

export class getDailyDto {
  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDateString()
  public date!: string;
}

export class createDailyDto {
  @IsNumber()
  public user_id!: number;

  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDateString()
  public date!: string;
}
