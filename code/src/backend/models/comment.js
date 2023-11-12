'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class Comment extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Comment.init({
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
    onUpdate: 'CASCADE',
  },
  authorRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  modelName: 'Comment',
  tableName: 'contents_comments',
});