'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class Reply extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Reply.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  commentRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'contents_comments', key: 'id' },
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
    type: DataTypes.TEXT
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
  modelName: 'Reply',
  tableName: 'contents_comments_replies',
});