'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users_memberships',
      [
        {
          userRef: 5,
          name: 'Super Fan',
          slug: 'super-fan',
          banner: '/membership-banner/super-fan.png',
          description:
            "You want to support me as a Super Fan, you're awesome! You have my eternal gratitude  ❤️  You'll also get access to...",
          price: 15000,
          createdAt: new Date('2023-11-01 12:28:00')
        },
        {
          userRef: 5,
          name: 'Eager Learner',
          slug: 'eager-learner',
          banner: '/membership-banner/eager-learner.png',
          description:
            "You want to learn digital art in Procreate by watching fully narrated tutorials in which I talk you through all the steps! You'll get access to...",
          price: 25000,
          createdAt: new Date('2023-11-01 12:48:00')
        },
        {
          userRef: 5,
          name: 'Master Student',
          slug: 'master-student',
          banner: '/membership-banner/master-student.png',
          description:
            "You are serious about learning digital art in Procreate! You want access to ALL fully narrated video tutorials I have ever shared, my favorite brushes, special discounts and more! You'll get access to...",
          price: 49999,
          createdAt: new Date('2023-11-01 13:30:00')
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_memberships', null, {})
  }
}
