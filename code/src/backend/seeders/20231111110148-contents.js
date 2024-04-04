'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'contents',
      [
        {
          creatorRef: 5,
          type: 'public',
          title: 'First With Love',
          body: '<p>This is my first content! Hope you guys like my content. This one will be open for free forever!</p><br/><p>Please follow me if you like my contents! Thankyou!</p>',
          status: 'published',
          publishedAt: new Date('2023-11-15 23:38:41'),
          createdAt: new Date('2023-11-15 19:38:41')
        },
        {
          creatorRef: 5,
          type: 'public',
          title: 'Second With Fire',
          body: '<p>This is my second content! Hope you guys like my content. This one will not for free forever!</p><br/><p>Please follow me if you like my contents! Thankyou!</p>',
          status: 'draft',
          publishedAt: new Date('2023-11-16 23:38:41'),
          createdAt: new Date('2023-11-16 19:38:41')
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contents', null, {})
  }
}
