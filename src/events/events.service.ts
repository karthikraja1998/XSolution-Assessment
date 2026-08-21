import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Event } from '../models/event.model';
import { WebhookSubscription } from '../models/webhook-subscription.model';
import { Delivery } from '../models/delivery.model';
import { CreateEventDto } from './dto/create-event.dto';
import * as _ from 'lodash';

@Injectable()
export class EventsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Event) private eventModel: typeof Event,
    @InjectModel(WebhookSubscription) private subscriptionModel: typeof WebhookSubscription,
    @InjectModel(Delivery) private deliveryModel: typeof Delivery,
  ) {}

  async create(tenantId: string, createDto: CreateEventDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const newEvent = await this.eventModel.create(
        {
          tenantId,
          eventType: createDto.eventType,
          payload: createDto.payload,
          idempotencyKey: createDto.idempotencyKey,
        },
        { transaction },
      );

      const activeSubscriptions = await this.subscriptionModel.findAll({
        where: { tenantId, isActive: true },
        transaction,
      });

      if (activeSubscriptions.length > 0) {
        const deliveries = activeSubscriptions.map((sub) => ({
          eventId: newEvent.id,
          subscriptionId: sub.id,
          status: 'PENDING',
          attempts: 0,
        }));

        await this.deliveryModel.bulkCreate(deliveries, { transaction });
      }

      await transaction.commit();
      return newEvent;
    } catch (error: any) {
      await transaction.rollback();

      if (error.name === 'SequelizeUniqueConstraintError') {
        const existingEvent = await this.eventModel.findOne({
          where: { tenantId, idempotencyKey: createDto.idempotencyKey },
        });

        if (!existingEvent) {
          throw new ConflictException('Idempotency collision occurred, but record could not be fetched.');
        }

        if (_.isEqual(existingEvent.payload, createDto.payload)) {
          return existingEvent;
        } else {
          throw new ConflictException('Idempotency key already used with a different payload');
        }
      }

      throw error;
    }
  }

  async findAll(tenantId: string) {
    return await this.eventModel.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
    });
  }
}
