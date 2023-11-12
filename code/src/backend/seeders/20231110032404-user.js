'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        role: 'admin',
        displayName: "MAIN ADMIN",
        email: "admin@example.com",
        password: "admin123",
        joinDate: new Date("2023-10-24 19:38:41"),
      },
      {
        role: 'normal',
        displayName: "User Normal 1",
        email: "user1@example.com",
        password: "user123",
        joinDate: new Date("2023-10-25 19:38:41"),
      },
      {
        role: 'normal',
        displayName: "User Normal 2",
        email: "user2@example.com",
        password: "user123",
        joinDate: new Date("2023-10-25 19:40:41"),
      },
      {
        role: 'normal',
        displayName: "User Normal 3",
        email: "user3@example.com",
        password: "user123",
        joinDate: new Date("2023-10-25 20:00:41"),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
