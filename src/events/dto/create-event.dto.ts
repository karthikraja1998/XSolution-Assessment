import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsObject()
  @IsNotEmpty()
  payload: any;

  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}
