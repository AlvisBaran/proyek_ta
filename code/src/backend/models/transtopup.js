'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class TransTopup extends Model {}

TransTopup.init(
  {
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
      onUpdate: 'CASCADE'
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
      values: ['pending', 'success', 'failed'],
      defaultValue: 'pending',
      allowNull: false
    },
    mt_payment_link: {
      type: DataTypes.TEXT
    },
    mt_transaction_id: {
      type: DataTypes.STRING
    },
    mt_order_id: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sqlz,
    modelName: 'TransTopup',
    tableName: 'trans_topup',
    paranoid: true
  }
)

export default TransTopup
