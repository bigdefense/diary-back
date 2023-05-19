import {IsDateString, IsNumber, IsString} from 'class-validator';

export class GetWeeklyDto {
  @IsString()
  public content!: string;

  @IsString()
  string_of_week!: string;

  @IsNumber()
  number_of_week!: number;
}

export class DeleteWeeklyDto {
  @IsString()
  string_of_week!: string;
  @IsNumber()
  number_of_week!: number;
}
export interface CreateWeeklyDto {
  user_id: number;
  content: string;
  string_of_week: string;
  number_of_week: number;
}
