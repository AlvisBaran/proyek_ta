'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class ContentRequestPayment extends Model {}

ContentRequestPayment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    contentRequestRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'contents_requests', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    userRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    nominal: {
      type: DataTypes.BIGINT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
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
    modelName: 'ContentRequestPayment',
    tableName: 'contents_requests_payments',
    paranoid: true
  }
)

export default ContentRequestPayment
