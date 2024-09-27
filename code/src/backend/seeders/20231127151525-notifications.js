'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.bulkInsert(
    //   'users_notifications',
    //   [
    //     {
    //       userRef: 1,
    //       title: 'Welcome!',
    //       body: 'You are an Admin now!',
    //       readStatus: true,
    //       createdAt: new Date('2023-10-24 19:39:00')
    //     },
    //     {
    //       userRef: 1,
    //       title: 'Alert!',
    //       body: 'New user has been promoted to creator with username: creator1.',
    //       createdAt: new Date('2023-11-14 20:39:00')
    //     },
    //     {
    //       userRef: 5,
    //       title: 'Alert!',
    //       body: 'Your membership Super Fan is created!',
    //       createdAt: new Date('2023-11-01 12:29:00')
    //     },
    //     {
    //       userRef: 5,
    //       title: 'Alert!',
    //       body: 'Your membership Eager Learner is created!',
    //       createdAt: new Date('2023-11-01 12:49:00')
    //     },
    //     {
    //       userRef: 5,
    //       title: 'Alert!',
    //       body: 'Your membership Master Student is created!',
    //       createdAt: new Date('2023-11-01 13:31:00')
    //     }
    //   ],
    //   {}
    // )
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('users_notifications', null, {})
  }
}
