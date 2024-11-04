'use strict';

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          role: 'normal',
          displayName: 'moondrop',
          email: 'nizarsyfiq@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 22:18:02'),
          saldo: 0,
          countryRef: 40
        },
        {
          role: 'normal',
          displayName: 'mira.the.miracle',
          email: 'miraprmswri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 01:48:34'),
          saldo: 0,
          countryRef: 83
        },
        {
          role: 'normal',
          displayName: 'pastel_petal',
          email: 'lianadevi@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16T01:43:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Bunny-Bun-Bun',
          email: 'ikmaliaandini@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 03:03:39'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'XMenXquisite',
          email: 'kwvinrmdhan@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 21:54:36'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'ahmadhabib743',
          email: 'ahmadhabib743@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 18:39:03'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SiJaka',
          email: 'jakawddya@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 06:07:18'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'cheetahlicious',
          email: 'isnaandriani@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 14:06:33'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'izz3211',
          email: 'izzulamr@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 13:50:57'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'husnifahri975',
          email: 'husnifahri975@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 03:49:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'NobleKnight',
          email: 'hanirhmat@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 16:59:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'aurora.amethyst',
          email: 'ginarhmni@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 07:41:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'November15',
          email: 'farhanjyaa@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 23:46:20'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'skyseeker',
          email: 'elangprtma@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 18:26:06'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'saindriani30',
          email: 'tisaindriani@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 22:46:37'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'LunarLion',
          email: 'damarsri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 11:20:42'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Echo Explorer',
          email: 'fajrimudzafar632@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 08:05:59'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'cici20',
          email: 'ciciyulli@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 06:31:17'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'gorgeous.girl.gamer',
          email: 'karinalarasati@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 07:10:08'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'bellarins',
          email: 'bellarins@gamil.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 17:10:44'),
          saldo: 0,
          countryRef: 40
        },
        {
          role: 'normal',
          displayName: 'Lemoncloud',
          email: 'nirmasantika@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 17:40:58'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'AlifFauzz',
          email: 'aliffauzz@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 18:15:05'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'ilhamakbar65',
          email: 'ilhamakbar65@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 11:30:05'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'papa_yuda',
          email: 'yudasntoso@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 17:30:17'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'troublemaker7417',
          email: 'widisari@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 19:37:36'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'sleepy_morning_glory',
          email: 'vunanrsita@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 08:44:46'),
          saldo: 0,
          countryRef: 112
        },
        {
          role: 'normal',
          displayName: 'ChickenNugget',
          email: 'hilmiakbar@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 06:09:31'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'moonlit.karima',
          email: 'karimalhakim@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 01:33:04'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'udasptrraa',
          email: 'udasptrraa@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 23:09:33'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'honeybee',
          email: 'tinorhman@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 04:47:48'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Eriri',
          email: 'eriwinarni@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 16:07:15'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SweetNSour',
          email: 'hidayatrohmad01@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 04:26:19'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'career.shintapramesti',
          email: 'shintapmesti@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 01:59:06'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'cutebabybearr',
          email: 'ikmaanisa@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 04:25:46'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'your.queen.shinta',
          email: 'ratushnta@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 14:55:59'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Kopi Tubruk',
          email: 'rudihartono@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 03:32:43'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'vicoamr',
          email: 'vicoamr@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 17:23:30'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'princess_ani',
          email: 'aninsetyaputri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 13:45:31'),
          saldo: 0,
          countryRef: 112
        },
        {
          role: 'normal',
          displayName: 'bukanoki',
          email: 'okiptrass@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 04:53:46'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Tango28',
          email: 'budiraharjo@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 17:16:50'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'raini.nia',
          email: 'nianraini@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 05:54:04'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'chocobanana',
          email: 'mitarhrjo@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 13:30:35'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'only_indahsetyawati',
          email: 'indahsetyawati@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 06:06:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'pohon_pisang',
          email: 'ikmalahmad@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 10:46:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Haidar',
          email: 'haidarsalman@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 00:22:04'),
          saldo: 0,
          countryRef: 13
        },
        {
          role: 'normal',
          displayName: 'jokoprstyo',
          email: 'jokoprstyo@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 12:16:12'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'little.mermaid',
          email: 'ichaandani@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 12:39:16'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'familytinywiny',
          email: 'intanputri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 02:09:22'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'hendra.w',
          email: 'hendrawjaya@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 07:14:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'LiraVale',
          email: 'nurulhidayati@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 09:20:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'vellichor',
          email: 'galuhprnama@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 10:34:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Adi2000',
          email: 'haryadipramana@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 23:46:43'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Zulu2555',
          email: 'fahminur5@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 11:51:09'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Eja Oranata',
          email: 'ejaoranata@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 20:15:33'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Deni57',
          email: 'denialamsyah@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 06:12:44'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Solstice',
          email: 'sultonahmad@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 12:34:17'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'queen_cintya',
          email: 'cintyamlati@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 00:50:09'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'sonyeondans',
          email: 'nurmaajeng@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 08:05:26'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'indomi.goreng.rendang',
          email: 'budisntika@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 15:49:58'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'moon.moonwalk',
          email: 'haryantosetiawan@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 21:40:01'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'yunasmile',
          email: 'hasbiamrullah@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 20:59:14'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'shaquille.oatmeal',
          email: 'adingroho@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-12 23:14:11'),
          saldo: 0,
          countryRef: 13
        },
        {
          role: 'normal',
          displayName: 'smolstan',
          email: 'katrindiana@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 18:17:28'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'yanazlkifli',
          email: 'yanazlkifli@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 11:34:28'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Wishkey69',
          email: 'wiramrdiyah@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 01:34:32'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'Casanova',
          email: 'vidiamra@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 14:15:19'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'umilstri',
          email: 'umilstri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 23:46:18'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'hiddeninsom4eternity',
          email: 'taniadwi@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 10:54:39'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'bang.bang.bang_killingme',
          email: 'rahmatfjri@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 23:15:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Vini',
          email: 'viniarfin@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 00:46:06'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Okari',
          email: 'okariana@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 02:40:45'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'rosmidasari51',
          email: 'rosmidasari51@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-15 05:17:38'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'wistfulwisteria',
          email: 'ratnadwiana@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 01:40:46'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'LuminescentLuxe',
          email: 'marlinasukma@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 10:41:01'),
          saldo: 0,
          countryRef: 236
        },
        {
          role: 'normal',
          displayName: 'Alpha77',
          email: 'faridhardja@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-17 15:44:22'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'MystiqueMingle',
          email: 'andreantoni@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 01:59:00'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Brian',
          email: 'hasanbriansah@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-14 18:47:47'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SmokeAndFire',
          email: 'mahdirayyan@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-18 08:15:45'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'harris',
          email: 'harrisnasir@gmaio.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-16 13:23:27'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'mosess88',
          email: 'mosessadarma@gmail.com',
          password: await bcrypt.hash('user123', 10),
          joinDate: new Date('2024-10-13 10:37:02'),
          saldo: 0,
          countryRef: 104
        }
      ],
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});     
  }
};
