'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date()
    await queryInterface.bulkInsert(
      'categories',
      [
        { label: 'Gaming', createdAt: date, updatedAt: date },
        { label: 'Art', createdAt: date, updatedAt: date },
        { label: 'Video', createdAt: date, updatedAt: date },
        { label: 'Nature', createdAt: date, updatedAt: date },
        { label: 'Technology', createdAt: date, updatedAt: date },
        { label: 'Blogs', createdAt: date, updatedAt: date }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {})
  }
}
