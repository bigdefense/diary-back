import {UsersInterFace} from '@/interface/users.interface';
import {
  IsString,
  IsEmail,
  Length,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UserDto implements UsersInterFace {
  @IsOptional()
  @IsNumber()
  public id!: number;

  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;

  @IsString()
  public name!: string;

  @IsString()
  public image!: string;

  @Length(0, 4)
  public image_type!: string;

  @IsOptional()
  @IsString()
  public refresh!: string;

  @IsOptional()
  @IsString()
  public email_code!: string;

  @IsOptional()
  @IsBoolean()
  public verified!: boolean;
}
