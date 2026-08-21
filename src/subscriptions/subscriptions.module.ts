import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { WebhookSubscription } from '../models/webhook-subscription.model';

@Module({
  imports: [SequelizeModule.forFeature([WebhookSubscription])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
