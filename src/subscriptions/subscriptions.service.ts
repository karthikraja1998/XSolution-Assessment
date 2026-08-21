import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WebhookSubscription } from '../models/webhook-subscription.model';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import * as crypto from 'crypto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(WebhookSubscription)
    private subscriptionModel: typeof WebhookSubscription,
  ) {}

  async create(tenantId: string, createDto: CreateSubscriptionDto) {
    const secret = crypto.randomBytes(32).toString('hex');

    return await this.subscriptionModel.create({
      tenantId,
      name: createDto.name,
      targetUrl: createDto.targetUrl,
      secret,
    });
  }

  async findAll(tenantId: string) {
    return await this.subscriptionModel.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
    });
  }

  async update(tenantId: string, id: string, updateDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionModel.findOne({
      where: { id, tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await subscription.update(updateDto);
    return subscription;
  }
}
