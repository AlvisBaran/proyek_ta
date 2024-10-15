'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class Country extends Model {}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      allowNull: false,
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
    modelName: 'Country',
    tableName: 'countries',
    paranoid: true
  }
)

export default Country
