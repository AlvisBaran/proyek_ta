'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '../configs/db';

class Reply extends Model {}

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

export default Reply