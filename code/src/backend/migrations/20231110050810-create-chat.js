'use strict'

const { DataTypes, literal } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users_messages_chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      messageRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users_messages', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      authorRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP')
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users_messages_chats')
  }
}
