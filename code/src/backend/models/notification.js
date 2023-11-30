'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class Notification extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate({ User }) {
    this.hasOne(User, { foreignKey: "userRef" });
  }
}

Notification.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  iconId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "notifications",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  readStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP'),
  },
}, {
  sequelize: sqlz,
  modelName: 'Notification',
  tableName: "users_notifications",
  updatedAt: false,
});