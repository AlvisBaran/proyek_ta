'use strict'

const { DataTypes, literal } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cUsername: {
        type: DataTypes.STRING,
        unique: true
      },
      role: {
        type: DataTypes.ENUM,
        values: ['normal', 'admin', 'creator'],
        defaultValue: 'normal',
        allowNull: false
      },
      saldo: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      banStatus: {
        type: DataTypes.ENUM,
        values: ['clean', 'banned', 'unbanned'],
        defaultValue: 'clean',
        allowNull: false
      },
      bannedDate: DataTypes.DATE,
      countryRef: {
        type: DataTypes.INTEGER,
        references: { model: 'countries', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      joinDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP')
      },
      displayName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        // INFO: Ini encryption
        type: DataTypes.TEXT('tiny')
      },
      profilePicture: {
        type: DataTypes.STRING
      },
      socials: DataTypes.TEXT,
      bio: DataTypes.TEXT,
      about: DataTypes.TEXT,
      banner: {
        type: DataTypes.STRING
      },
      themeColor: {
        type: DataTypes.STRING,
        defaultValue: '#eee',
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
}
