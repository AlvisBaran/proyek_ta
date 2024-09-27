'use strict'

const { DataTypes, literal } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trans_withdraw', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      nomorRekening: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bankRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'banks', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      nominal: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM,
        values: ['on-hold', 'approved', 'declined'],
        defaultValue: 'on-hold',
        allowNull: false
      },
      proofOfTransfer: {
        type: DataTypes.STRING(255)
      },
      note: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('trans_withdraw')
  }
}
