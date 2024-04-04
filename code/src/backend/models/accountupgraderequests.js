'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class AccountUpgradeRequests extends Model {}

AccountUpgradeRequests.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    applicantRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['requested', 'approved', 'declined'],
      defaultValue: 'requested',
      allowNull: false
    },
    newUsername: {
      type: DataTypes.STRING
    },
    adminRef: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    adminNote: {
      type: DataTypes.TEXT
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    modifiedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sqlz,
    modelName: 'AccountUpgradeRequests',
    tableName: 'account_upgrade_requests',
    createdAt: 'requestedAt',
    updatedAt: 'modifiedAt'
  }
)

export default AccountUpgradeRequests
