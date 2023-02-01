import {ArrayNotEmpty, IsNumber} from 'class-validator';

export class PagesDto {
  @IsNumber()
  public user_id!: number;

  @ArrayNotEmpty()
  public password!: Array<Date>;
}
