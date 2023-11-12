'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        role: 'creator',
        displayName: "Creator 1",
        email: "creator1@example.com",
        password: "creator123",
        bio: "I am an artist of abstraction and creativity. Follow me if you like my artwork!",
        about: "<h1>It's me melowmelow-chan!</h1><p>Follow if you like my arts!</p>",
        themeColor: "#BE3144",
        joinDate: new Date("2023-11-14 20:38:41"),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('users', null, {});
  }
};
