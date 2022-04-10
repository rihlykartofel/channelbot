import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'user_chat' })
export class UserChat extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chat_id!: number;
}