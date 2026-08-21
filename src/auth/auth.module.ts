import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' }, // standard for access tokens
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
