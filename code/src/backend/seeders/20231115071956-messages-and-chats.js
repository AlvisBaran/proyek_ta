'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users_messages',
      [
        {
          user1Ref: 2,
          user2Ref: 3,
          createdAt: new Date('2023-10-27 00:30:00'),
          lastModified: new Date('2023-10-27 00:36:00')
        },
        {
          user1Ref: 4,
          user2Ref: 2,
          createdAt: new Date('2023-10-28 00:30:00'),
          lastModified: new Date('2023-10-28 00:33:00')
        }
      ],
      {}
    )

    await queryInterface.bulkInsert(
      'users_messages_chats',
      [
        {
          messagesRef: 1,
          authorRef: 2,
          content: 'Hey User 3, what are you doing?',
          createdAt: new Date('2023-10-27 00:31:00')
        },
        {
          messagesRef: 1,
          authorRef: 3,
          content: 'Hey User 2, I am creating my new page for my arts. What is up?',
          createdAt: new Date('2023-10-27 00:34:00')
        },
        {
          messagesRef: 1,
          authorRef: 2,
          content:
            "Nah I'm just want to get in touch with you. Please update me if your page is done! I'll be waiting :))",
          createdAt: new Date('2023-10-27 00:36:00')
        },
        {
          messagesRef: 2,
          authorRef: 4,
          content: 'Hey User 2, are you an artist?',
          createdAt: new Date('2023-10-28 00:31:00')
        },
        {
          messagesRef: 2,
          authorRef: 2,
          content: 'Hey User 4, I am not an artist. Sorry, but I do know someone. Do you want me to share the contact?',
          createdAt: new Date('2023-10-28 00:32:00')
        },
        {
          messagesRef: 2,
          authorRef: 4,
          content: "Nahh, that's fine, I'll search it my self. Thankyou!",
          createdAt: new Date('2023-10-28 00:33:00')
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_messages_chats', null, {})
    await queryInterface.bulkDelete('users_messages', null, {})
  }
}
