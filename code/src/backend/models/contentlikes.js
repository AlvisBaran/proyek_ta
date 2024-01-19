'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

class ContentLikes extends Model {}

ContentLikes.init({
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
  performerRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  deletedAt: {
    type: DataTypes.DATE
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP'),
  },
}, {
  sequelize: sqlz,
  modelName: 'ContentLikes',
  tableName: 'contents_likes',
  paranoid: true,
  updatedAt: false,
});

export default ContentLikes