'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'categories',
      [
        { label: 'Gaming' },
        { label: 'Art' },
        { label: 'Video' },
        { label: 'Nature' },
        { label: 'Technology' },
        { label: 'Blogs' }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {})
  }
}
