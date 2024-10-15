'use strict'

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          role: 'admin',
          displayName: 'MAIN ADMIN',
          email: 'admin@example.com',
          profilePicture: 'user1@example.com/profile-picture/946bf74f-beb6-44ed-a017-7b78765f5bee-1723019962767.png',
          password: await bcrypt.hash('admin123', 10),
          joinDate: new Date('2023-10-24 19:38:41'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'User Normal 1',
          email: 'user1@example.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2023-10-25 19:38:41'),
          saldo: 200000,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'User Normal 2',
          email: 'user2@example.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2023-10-25 19:40:41'),
          saldo: 20000,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'User Normal 3',
          email: 'user3@example.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2023-10-25 20:00:41'),
          saldo: 15000,
          countryRef: 104
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
