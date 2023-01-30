import {IsString, IsEmail, Length} from 'class-validator';

export class createUserDto {
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
