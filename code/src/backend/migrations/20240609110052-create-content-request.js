'use strict'

const { DataTypes, literal } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contents_requests', {
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
      applicantRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      contentRef: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        references: { model: 'contents', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      requestNote: {
        type: DataTypes.TEXT('medium')
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          'requested',
          'on-progress',
          'waiting-requestor-confirmation',
          'waiting-payment',
          'waiting-creator-confirmation',
          'done'
        ],
        defaultValue: 'requested',
        allowNull: false
      },
      price: {
        type: DataTypes.BIGINT
      },
      leftoverPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      canceledAt: {
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contents_requests')
  }
}
