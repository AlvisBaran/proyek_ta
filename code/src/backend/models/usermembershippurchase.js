'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class UserMembershipPurchase extends Model {}

UserMembershipPurchase.init(
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
    membershipRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users_memberships', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    grandTotal: {
      type: DataTypes.BIGINT
    },
    expiredAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sqlz,
    modelName: 'UserMembershipPurchase',
    tableName: 'users_memberships_purchases'
  }
)

export default UserMembershipPurchase
