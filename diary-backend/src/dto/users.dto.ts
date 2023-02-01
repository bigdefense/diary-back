import {IsString, IsEmail, Length} from 'class-validator';

export class UserDto {
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
}
