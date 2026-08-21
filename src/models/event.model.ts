import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tenant } from './tenant.model';

@Table({
  tableName: 'events',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tenantId', 'idempotencyKey'],
    },
  ],
})
export class Event extends Model {
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
  eventType: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  payload: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  idempotencyKey: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  tenantId: string;

  @BelongsTo(() => Tenant)
  tenant: Tenant;
}
