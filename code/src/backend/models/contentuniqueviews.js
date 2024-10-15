'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '@/backend/configs/db'

class ContentUniqueViews extends Model {}

ContentUniqueViews.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    contentRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'contents', key: 'id' },
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  },
  {
    sequelize: sqlz,
    modelName: 'ContentUniqueViews',
    tableName: 'contents_unique_views',
    updatedAt: false
  }
)

export default ContentUniqueViews
