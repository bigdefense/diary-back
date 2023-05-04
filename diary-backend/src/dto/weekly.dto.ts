import {IsDate, IsDateString, IsNumber, IsString} from 'class-validator';

export class GetWeeklyDto {
  @IsString()
  public content!: string;

  @IsDateString()
  public date!: string;
}

export interface CreateWeeklyDto {
  user_id: number;
  content: string;
  date: string;
}
