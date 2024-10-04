'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class ContentGallery extends Model {}

ContentGallery.init(
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
    name: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      values: ['image', 'video'],
      defaultValue: 'image',
      allowNull: false
    },
    minio_object_name: {
      type: DataTypes.STRING
    },
    deletedAt: {
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
    modelName: 'ContentGallery',
    tableName: 'contents_galleries',
    paranoid: true
  }
)

export default ContentGallery
