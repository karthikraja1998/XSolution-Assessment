import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  targetUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
