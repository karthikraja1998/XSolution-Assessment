import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from '../models/event.model';
import { WebhookSubscription } from '../models/webhook-subscription.model';
import { Delivery } from '../models/delivery.model';

@Module({
  imports: [SequelizeModule.forFeature([Event, WebhookSubscription, Delivery])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
