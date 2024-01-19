'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

class TransWithdraw extends Model {}

TransWithdraw.init({
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
  invoice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nominal: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['on-hold', 'approved', 'declined'],
    defaultValue: 'on-hold',
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT
  },
  requestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP'),
  },
  repliedAt: {
    type: DataTypes.DATE
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  sequelize: sqlz,
  modelName: 'TransWithdraw',
  tableName: 'trans_withdraw',
  paranoid: true,
});

export default TransWithdraw