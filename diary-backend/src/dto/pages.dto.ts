import {ArrayNotEmpty, IsNumber} from 'class-validator';

export class createPagesDto {
  @IsNumber()
  public user_id!: number;

  @ArrayNotEmpty()
  public password!: Array<Date>;
}
