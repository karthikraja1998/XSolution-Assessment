import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { User } from './user.model';

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
  })
  declare name: string;

  @HasMany(() => User)
  declare users: User[];
}
