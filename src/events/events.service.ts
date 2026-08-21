import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../models/event.model';
import { CreateEventDto } from './dto/create-event.dto';
import * as _ from 'lodash';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  async create(tenantId: string, createDto: CreateEventDto) {
    try {
      // 1. Attempt to create the event
      const newEvent = await this.eventModel.create({
        tenantId,
        eventType: createDto.eventType,
        payload: createDto.payload,
        idempotencyKey: createDto.idempotencyKey,
      });
      return newEvent;
    } catch (error: any) {
      // 2. Catch database unique constraint violations for idempotency
      if (error.name === 'SequelizeUniqueConstraintError') {
        const existingEvent = await this.eventModel.findOne({
          where: { tenantId, idempotencyKey: createDto.idempotencyKey },
        });

        if (!existingEvent) {
          throw new ConflictException('Idempotency collision occurred, but record could not be fetched.');
        }

        // 3. Deep compare payload
        if (_.isEqual(existingEvent.payload, createDto.payload)) {
          // Idempotent success (Requirement: The same tenant, idempotency key, and payload must return the existing event)
          return existingEvent;
        } else {
          // Requirement: Reusing the same key with a different payload must return 409 Conflict
          throw new ConflictException('Idempotency key already used with a different payload');
        }
      }

      // Re-throw any other unexpected errors
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
