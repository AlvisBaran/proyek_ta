'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('contents_comments', [
      {
        contentRef: 1,
        authorRef: 2,
        content: "Wow this is an awesome content. :)",
        createdAt: new Date("2023-11-01 19:39:00"),
        updatedAt: new Date("2023-11-01 19:39:00"),
      },
      {
        contentRef: 1,
        authorRef: 3,
        content: "Indeed this is wonderfull. :)",
        createdAt: new Date("2023-11-02 19:39:00"),
        updatedAt: new Date("2023-11-02 19:39:00"),
      },
    ], {});
    await queryInterface.bulkInsert('contents_comments_replies', [
      {
        commentRef: 1,
        authorRef: 4,
        content: "Your comment is nice. Good job!",
        createdAt: new Date("2023-11-05 19:39:00"),
        updatedAt: new Date("2023-11-05 19:39:00"),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contents_comments', null, {});
    await queryInterface.bulkDelete('contents_comments_replies', null, {});
  }
};
