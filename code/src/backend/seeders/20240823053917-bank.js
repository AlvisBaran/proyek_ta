'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'banks',
      [
        { name: 'Bank Central Asia', alias: 'BCA', swiftCode: '014' },
        { name: 'Mandiri', swiftCode: '008' },
        { name: 'Bank Negara Indonesia', alias: 'BNI', swiftCode: '009' },
        { name: 'Syariah Indonesia (Eks BNI SYARIAH)', swiftCode: '427' },
        { name: 'Bank Rakyat Indonesia', alias: 'BRI', swiftCode: '002' },
        { name: 'Syariah Indonesia (Eks BSM)', swiftCode: '451' },
        { name: 'CIMB Niaga', swiftCode: '022' },
        { name: 'CIMB Niaga Syariah', swiftCode: '022' },
        { name: 'Muamalat', swiftCode: '147' },
        { name: 'Bank Tabungan Pensiunan Nasional', alias: 'BTPN', swiftCode: '213' },
        { name: 'BTPN Syariah', swiftCode: '547' },
        { name: 'Jenius', swiftCode: '213' },
        { name: 'Syariah Indonesia (Eks BRI Syariah)', swiftCode: '422' },
        { name: 'Tabungan Negara (Bank BTN)', swiftCode: '200' },
        { name: 'Permata Bank', swiftCode: '013' },
        { name: 'Danamon', swiftCode: '011' },
        { name: 'BII Maybank', swiftCode: '016' },
        { name: 'Mega', swiftCode: '426' },
        { name: 'Sinar Mas', swiftCode: '153' },
        { name: 'Commonwealth', swiftCode: '950' },
        { name: 'OCBC NISP', swiftCode: '028' },
        { name: 'KB Bukopin', swiftCode: '441' },
        { name: 'KB Bukopin Syariah', swiftCode: '521' },
        { name: 'BCA Syariah', swiftCode: '536' },
        { name: 'Lippo', swiftCode: '026' },
        { name: 'Citibank', swiftCode: '031' },
        { name: 'Indosat Dompetku', swiftCode: '789' },
        { name: 'Telkomsel Tcash', swiftCode: '911' },
        { name: 'LinkAja', swiftCode: '911' },
        { name: 'DBS Indonesia', swiftCode: '046' },
        { name: 'Digibank', swiftCode: '046' },
        { name: 'SeaBank (Eks Bank Kesejahteraan Ekonomi)', swiftCode: '535' },
        { name: 'Jago (Eks Bank Artos Indonesia)', swiftCode: '542' },
        { name: 'UOB Indonesia', swiftCode: '023' },
        { name: 'TMRW by UOB Indonesia', swiftCode: '023' },
        { name: 'Neo Commerce (Akulaku)', swiftCode: '490' },
        { name: 'Allo Bank (Eks Bank Harda)', swiftCode: '567' },
        { name: 'Aladin Syariah (Eks Bank Maybank Indocorp)', swiftCode: '947' }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('banks', null, {})
  }
}
