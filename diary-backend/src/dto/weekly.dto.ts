import {IsDate, IsNumber, IsString} from 'class-validator';

export class weeklyDto {
  @IsString()
  public content!: string;

  @IsDate()
  public date!: string;

  @IsNumber()
  public week_day_name!: number;
}

// export interface DailyDairy {
//   id: number;
//   user_id: number;
//   title: string;
//   content: string;
//   date: string;
// }
