import {IsDate, IsNumber, IsString} from 'class-validator';

export class MonthlyDto {
  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDate()
  public date!: string;

  @IsNumber()
  public priority!: number;
}

// export interface DailyDairy {
//   id: number;
//   user_id: number;
//   title: string;
//   content: string;
//   date: string;
// }
