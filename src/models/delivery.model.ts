import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Event } from './event.model';
import { WebhookSubscription } from './webhook-subscription.model';

@Table({
  tableName: 'deliveries',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['eventId', 'subscriptionId'],
    },
  ],
})
export class Delivery extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  eventId: string;

  @BelongsTo(() => Event)
  event: Event;

  @ForeignKey(() => WebhookSubscription)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  subscriptionId: string;

  @BelongsTo(() => WebhookSubscription)
  subscription: WebhookSubscription;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  lastError: string | null;
}
