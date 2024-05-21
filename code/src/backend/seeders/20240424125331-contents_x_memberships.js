'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'memberships_x_contents',
      [
        { membershipRef: 1, contentRef: 1 },
        { membershipRef: 2, contentRef: 2 }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('memberships_x_contents', null, {})
  }
}
