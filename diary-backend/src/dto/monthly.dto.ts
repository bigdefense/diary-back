import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

export class GetMonthlyDto {
  @IsArray()
  public content!: Array<string>;

  @IsDateString()
  public date!: string;
}

export class DeleteMonthlyDto {
  @IsDateString()
  public date!: string;
}

export class CreateMonthlyDto {
  @IsNumber()
  public user_id!: number;

  @IsArray()
  public content!: Array<string>;

  @IsDateString()
  public date!: string;
}

// export interface DailyDiary {
//   id: number;
//   user_id: number;
//   title: string;
//   content: string;
//   date: string;
// }
