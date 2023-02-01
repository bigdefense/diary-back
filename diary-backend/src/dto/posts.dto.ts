import {IsString, IsDate, IsNumber} from 'class-validator';

export class PostsDto {
  @IsNumber()
  public page_id!: number;

  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

  @IsDate()
  public date!: Date;

  @IsNumber()
  public priority!: number;
}
