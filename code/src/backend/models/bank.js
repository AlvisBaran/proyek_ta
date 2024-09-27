'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class Bank extends Model {}

Bank.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    alias: {
      type: DataTypes.STRING
    },
    swiftCode: {
      type: DataTypes.STRING
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
    modelName: 'Bank',
    tableName: 'banks',
    paranoid: true
  }
)

export default Bank
