import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Tenant } from './models/tenant.model';
import { User } from './models/user.model';
import { AuthModule } from './auth/auth.module';
dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: (process.env.DB_DIALECT as any) || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      logging: false,
      models: [Tenant, User],
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
