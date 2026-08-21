import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tenant } from './tenant.model';

@Table({ tableName: 'webhook_subscriptions', timestamps: true })
export class WebhookSubscription extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  targetUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secret: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId: string;

  @BelongsTo(() => Tenant)
  tenant: Tenant;
}
