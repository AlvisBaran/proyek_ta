'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class CategoriesXContents extends Model {}

CategoriesXContents.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    categoryRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    contentRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'contents', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  },
  {
    sequelize: sqlz,
    modelName: 'CategoriesXContents',
    tableName: 'categories_x_contents',
    updatedAt: false
  }
)

export default CategoriesXContents
