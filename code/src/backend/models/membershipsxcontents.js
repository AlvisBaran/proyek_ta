'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class MembershipsXContents extends Model {}

MembershipsXContents.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    membershipRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users_memberships', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    contentRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'contents', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  },
  {
    sequelize: sqlz,
    modelName: 'MembershipsXContents',
    tableName: 'memberships_x_contents',
    updatedAt: false
  }
)

export default MembershipsXContents
