'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'
import { slugify } from '@/utils/textHelper.mjs'

class Membership extends Model {}

Membership.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.TEXT,
      // unique: true,
      allowNull: false
      // set(value) {
      //   this.setDataValue('slug', slugify(this.name))
      // }
    },
    banner: {
      // Sementara
      type: DataTypes.TEXT('tiny')
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1000
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
    modelName: 'Membership',
    tableName: 'users_memberships'
  }
)

export default Membership
