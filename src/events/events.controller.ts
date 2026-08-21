import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../models/user.model';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.OPERATOR, UserRole.TENANT_ADMIN)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(req.user.tenantId, createEventDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.eventsService.findAll(req.user.tenantId);
  }
}
