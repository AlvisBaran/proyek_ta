'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users_follows', [
      {
        followerRef: 2,
        followedRef: 5,
        createdAt: new Date("2023-10-24 19:39:00"),
        updatedAt: new Date("2023-10-24 19:39:00"),
      },
      {
        followerRef: 3,
        followedRef: 5,
        createdAt: new Date("2023-10-25 19:39:00"),
        updatedAt: new Date("2023-10-25 19:39:00"),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_follows', null, {});
  }
};
