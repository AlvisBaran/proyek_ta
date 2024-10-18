'use strict'

const dayjs = require('dayjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    function generateCreatedAtAndExpiredAt(iteration) {
      const dateNow = dayjs().subtract(iteration, 'month')
      return {
        createdAt: dateNow.toDate(),
        expiredAt: dateNow.add(30, 'day').toDate()
      }
    }
    await queryInterface.bulkInsert(
      'users_memberships_purchases',
      [
        // * User 2, This Year
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(0) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(1) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(2) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(3) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(4) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(5) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(6) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(7) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(8) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(9) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(10) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(11) },
        // * User 3, This Year
        { userRef: 3, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(0) },
        { userRef: 3, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(2) },
        { userRef: 3, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(4) },
        { userRef: 3, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(5) },
        // * User 2, Year - 1
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(12) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(13) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(14) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(15) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(16) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(17) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(18) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(19) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(20) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(21) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(22) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(23) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(24) },
        // * User 2, Year - 2
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(25) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(26) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(27) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(28) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(29) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(30) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(31) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(32) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(33) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(34) },
        { userRef: 2, membershipRef: 2, grandTotal: 25000, ...generateCreatedAtAndExpiredAt(35) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(36) },
        // * User 2, Year - 3
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(37) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(38) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(39) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(40) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(41) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(42) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(43) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(44) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(45) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(46) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(47) },
        { userRef: 2, membershipRef: 1, grandTotal: 15000, ...generateCreatedAtAndExpiredAt(48) }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_memberships_purchases', null, {})
  }
}
