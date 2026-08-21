import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({ require_tld: false }) // Allow localhost urls for assessment
  @IsNotEmpty()
  targetUrl: string;
}
