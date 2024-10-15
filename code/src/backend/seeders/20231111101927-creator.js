'use strict'

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          role: 'creator',
          displayName: 'Creator 1',
          email: 'creator1@example.com',
          profilePicture: 'creator1/profile-picture/c0588d6a-f565-4e54-9e70-d7086fe9d96b-1723020646357.png',
          banner: 'creator1/banner/19524cc7-b7ec-454a-a723-57643ed62f36-1723020646414.png',
          cUsername: 'creator1',
          password: await bcrypt.hash('creator123', 10),
          bio: 'I am an artist of abstraction and creativity. Follow me if you like my artwork!',
          about: "<h1>It's me melowmelow-chan!</h1><p>Follow if you like my arts!</p>",
          themeColor: '#BE3144',
          joinDate: new Date('2023-11-14 20:38:41'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'creator',
          displayName: 'Creator 2',
          email: 'creator2@example.com',
          profilePicture: 'creator1/profile-picture/c0588d6a-f565-4e54-9e70-d7086fe9d96b-1723020646357.png',
          banner: 'creator1/banner/19524cc7-b7ec-454a-a723-57643ed62f36-1723020646414.png',
          cUsername: 'creator2',
          password: await bcrypt.hash('creator123', 10),
          bio: 'You like blood? Me like too!',
          about: '<p>Follow if you like my arts!</p>',
          themeColor: '#BE3144',
          joinDate: new Date('2023-12-14 20:38:41'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'creator',
          displayName: 'Creator 3',
          email: 'creator3@example.com',
          profilePicture: 'creator1/profile-picture/c0588d6a-f565-4e54-9e70-d7086fe9d96b-1723020646357.png',
          banner: 'creator1/banner/19524cc7-b7ec-454a-a723-57643ed62f36-1723020646414.png',
          cUsername: 'creator3',
          password: await bcrypt.hash('creator123', 10),
          bio: 'You like flowers? Me like too!',
          about: '<p>Follow if you like my arts!</p>',
          themeColor: '#BE3144',
          joinDate: new Date('2023-12-16 20:38:41'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'creator',
          displayName: 'Art Person Alvis',
          email: 'artpersonalvis@gmail.com',
          profilePicture: 'creator1/profile-picture/c0588d6a-f565-4e54-9e70-d7086fe9d96b-1723020646357.png',
          banner: 'creator1/banner/19524cc7-b7ec-454a-a723-57643ed62f36-1723020646414.png',
          cUsername: 'artpersonavlis',
          password: await bcrypt.hash('creator123', 10),
          bio: 'You like alvis? Me like too!',
          about: '<p>Follow if you like my arts!</p>',
          themeColor: '#BE3144',
          joinDate: new Date('2023-12-17 20:38:41'),
          saldo: 0,
          countryRef: 104
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('users', null, {});
  }
}
