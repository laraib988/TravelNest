import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  hold_id!: string;

  @IsString()
  @IsNotEmpty()
  lead_name!: string;

  @IsEmail()
  @IsNotEmpty()
  lead_email!: string;

  @IsString()
  @IsNotEmpty()
  lead_phone!: string;

  @IsString()
  @IsOptional()
  special_requirements?: string;

  @IsString()
  @IsOptional()
  payment_token?: string;
}
