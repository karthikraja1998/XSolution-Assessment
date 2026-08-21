import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { WebhookSubscription } from './webhook-subscription.model';
import { Event } from './event.model';

@Table({ tableName: 'tenants', timestamps: true })
export class Tenant extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => User)
  users: User[];

  @HasMany(() => WebhookSubscription)
  subscriptions: WebhookSubscription[];

  @HasMany(() => Event)
  events: Event[];
}
