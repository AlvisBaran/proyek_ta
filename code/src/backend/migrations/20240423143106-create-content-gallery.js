'use strict'

const { DataTypes, literal } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contents_galleries', {
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
      title: {
        type: DataTypes.STRING
      },
      alt: {
        type: DataTypes.STRING
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
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contents_galleries')
  }
}
