'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class UsersWalletHistory extends Model {}

UsersWalletHistory.init(
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
    nominal: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['in', 'out'],
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sqlz,
    modelName: 'UsersWalletHistory',
    tableName: 'users_wallet_history',
    updatedAt: false,
    paranoid: true
  }
)

export default UsersWalletHistory
