'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'account_upgrade_requests',
      [
        {
          applicantRef: 2,
          newUsername: 'usersatu',
          requestedAt: new Date('2023-11-10 19:38:41')
        },
        {
          applicantRef: 3,
          newUsername: 'userdua',
          requestedAt: new Date('2023-11-2 10:30:41')
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('account_upgrade_requests', null, {})
  }
}
