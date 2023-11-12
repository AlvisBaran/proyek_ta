'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class ContentShares extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

ContentShares.init({
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
  sharerRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  openerRef: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP'),
  }
}, {
  sequelize: sqlz,
  modelName: 'ContentShares',
  tableName: 'contents_shares',
  updatedAt: false,
});