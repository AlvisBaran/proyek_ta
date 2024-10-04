'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class Content extends Model {}

Content.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    creatorRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM,
      values: ['public', 'private'],
      defaultValue: 'public',
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT('tiny'),
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT('tiny')
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM,
      values: ['draft', 'published'],
      defaultValue: 'draft',
      allowNull: false
    },
    contentRequestRef: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    viewCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    likeCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    shareCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    publishedAt: {
      type: DataTypes.DATE
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
    modelName: 'Content',
    tableName: 'contents',
    paranoid: true
  }
)

export default Content
