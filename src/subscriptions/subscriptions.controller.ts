import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../models/user.model';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.TENANT_ADMIN)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Request() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req.user.tenantId, createSubscriptionDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.subscriptionsService.findAll(req.user.tenantId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(req.user.tenantId, id, updateSubscriptionDto);
  }
}
