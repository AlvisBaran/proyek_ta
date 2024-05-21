'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'categories_x_contents',
      [
        { categoryRef: 1, contentRef: 1 },
        { categoryRef: 2, contentRef: 1 },
        { categoryRef: 3, contentRef: 1 },
        { categoryRef: 3, contentRef: 2 },
        { categoryRef: 4, contentRef: 2 },
        { categoryRef: 5, contentRef: 2 },
        { categoryRef: 6, contentRef: 2 }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories_x_contents', null, {})
  }
}
