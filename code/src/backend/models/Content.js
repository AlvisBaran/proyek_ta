'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class Content extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Content.init({
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
    onUpdate: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM,
    values: ['public', 'private'],
    defaultValue: 'public',
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT('tiny'),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'published'],
    defaultValue: 'draft',
    allowNull: false,
  },
  likeCounter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  shareCounter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
    defaultValue: literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE
  }
}, {
  sequelize: sqlz,
  modelName: 'Content',
  tableName: 'contents',
  paranoid: true,
});