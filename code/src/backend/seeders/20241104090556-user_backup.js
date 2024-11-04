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
          password: '$2b$10$7zzuQsGTjJl4ceiRJmw4pe8NY93wePgkMhrQ14f51KioPzDuGDvNK',
          joinDate: new Date('2024-10-17 22:18:02'),
          saldo: 0,
          countryRef: 40
        },
        {
          role: 'normal',
          displayName: 'mira.the.miracle',
          email: 'miraprmswri@gmail.com',
          password: '$2b$10$FfRS/mzgH9ui0KOlBsKzbu46CPPfBnKbgcykkJKrcVhk5eYBw45be',
          joinDate: new Date('2024-10-17 01:48:34'),
          saldo: 0,
          countryRef: 83
        },
        {
          role: 'normal',
          displayName: 'pastel_petal',
          email: 'lianadevi@gmail.com',
          password: '$2b$10$bJb/E4Amm7cbMJpAWnPdzuQMfDE32gf61EQp01q36wDroACsBAfkG',
          joinDate: new Date('2024-10-16T01:43:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Bunny-Bun-Bun',
          email: 'ikmaliaandini@gmail.com',
          password: '$2b$10$BwHZAEOMZYJ.TSYu3Ut4g.Yx8b1B2amtRzi6PiG0w2/l57J/ks12q',
          joinDate: new Date('2024-10-14 03:03:39'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'XMenXquisite',
          email: 'kwvinrmdhan@gmail.com',
          password: '$2b$10$bNKcyCf5mdUXJWYJN0RBwu2RDTJ.dSn1ZKAdJ2ihVUc1.gU9XgmvS',
          joinDate: new Date('2024-10-12 21:54:36'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'ahmadhabib743',
          email: 'ahmadhabib743@gmail.com',
          password: '$2b$10$VJWcCHg4o8pgR99JKrI7peU2xPYliVLOKTEohm6ZJflaFWywO0BQi',
          joinDate: new Date('2024-10-17 18:39:03'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SiJaka',
          email: 'jakawddya@gmail.com',
          password: '$2b$10$tGsTZS92w50k1zNe48O4AeGV0mhPhfodxr2QWEczXy8T3MGkesQla',
          joinDate: new Date('2024-10-15 06:07:18'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'cheetahlicious',
          email: 'isnaandriani@gmail.com',
          password: '$2b$10$cDtAkpETwgnnb6zuXtzTZ.o3KWmEUoeF1eXf1josr7IAnchaf40KK',
          joinDate: new Date('2024-10-17 14:06:33'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'izz3211',
          email: 'izzulamr@gmail.com',
          password: '$2b$10$DMdu6cUu2sEnBzTNsHRK1.odoLJ6S90LAIrFfGaLI19oxgmJBjIca',
          joinDate: new Date('2024-10-13 13:50:57'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'husnifahri975',
          email: 'husnifahri975@gmail.com',
          password: '$2b$10$BBnFWFdgbPyO44MU2ydJRe0Wxrec33oajyZVWBYnq.dbMOQY74Kpe',
          joinDate: new Date('2024-10-14 03:49:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'NobleKnight',
          email: 'hanirhmat@gmail.com',
          password: '$2b$10$IptvB7sCqkGDpydSFJH0AOFhSXtVFL/3Kd6hP1N7twqK3uDRl9w7.',
          joinDate: new Date('2024-10-13 16:59:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'aurora.amethyst',
          email: 'ginarhmni@gmail.com',
          password: '$2b$10$ids4PWtKkmo2LbapHD0LZegy2P47i/L9TVZhv2krue6e1cq2Q5llG',
          joinDate: new Date('2024-10-13 07:41:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'November15',
          email: 'farhanjyaa@gmail.com',
          password: '$2b$10$Y8I2xuBBD0jnp3cME6qW3eQ2gUtEbznck6EM9eE2qNTnssmOw1wC6',
          joinDate: new Date('2024-10-14 23:46:20'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'skyseeker',
          email: 'elangprtma@gmail.com',
          password: '$2b$10$.wQ5XPhX4Z/jLZSt7Y/UL.U/xS/f945nn6VbCfmnmIDknBlZp8Gwu',
          joinDate: new Date('2024-10-13 18:26:06'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'saindriani30',
          email: 'tisaindriani@gmail.com',
          password: '$2b$10$mdbkXHGCoH4AUh4awUPVHuZ2JQqmVUOmoMwF4QS05F3vBdnBRBXnC',
          joinDate: new Date('2024-10-12 22:46:37'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'LunarLion',
          email: 'damarsri@gmail.com',
          password: '$2b$10$llXN.v6Tw8yi32nMDBYC8u6K2OOkNTRvIMOAMErUrURCeTwX7PwQe',
          joinDate: new Date('2024-10-18 11:20:42'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Echo Explorer',
          email: 'fajrimudzafar632@gmail.com',
          password: '$2b$10$HZDBaO7VHooCgG1uI.HnG.rZQRcFDwM0WP1dUnWUjjbATww2Fyzv6',
          joinDate: new Date('2024-10-18 08:05:59'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'cici20',
          email: 'ciciyulli@gmail.com',
          password: '$2b$10$rdjx/ydcT02YPTnvtaTT0.BJaVxweb2IeDKQAaWk1PPkRKGpjps6C',
          joinDate: new Date('2024-10-17 06:31:17'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'gorgeous.girl.gamer',
          email: 'karinalarasati@gmail.com',
          password: '$2b$10$MzgCGS/DGYK.F7cpWUeRk.NiB02O0JKGGHdBjEEO1e6ee9BDtrDH.',
          joinDate: new Date('2024-10-18 07:10:08'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'bellarins',
          email: 'bellarins@gamil.com',
          password: '$2b$10$QEe0jhQy3podxGAjtuN6JOoaq49OB9o1/i/ATZeIPdNblnB24.PNe',
          joinDate: new Date('2024-10-12 17:10:44'),
          saldo: 0,
          countryRef: 40
        },
        {
          role: 'normal',
          displayName: 'Lemoncloud',
          email: 'nirmasantika@gmail.com',
          password: '$2b$10$NztwoAbHdNUe0Epfl1lk/.F8.31ACNDiyffr64dWXF7/SwkALVKci',
          joinDate: new Date('2024-10-17 17:40:58'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'AlifFauzz',
          email: 'aliffauzz@gmail.com',
          password: '$2b$10$uKUIcB.Gxdnu4u72.D1CFuLdDkh94l4sDjHBBhRkuxpwCkYbigHCe',
          joinDate: new Date('2024-10-16 18:15:05'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'ilhamakbar65',
          email: 'ilhamakbar65@gmail.com',
          password: '$2b$10$Y6rr5NJF6u3nTD9ut4tyxew1ZOrynPW/Z1wpl1M/lRfKIbLWofBy2',
          joinDate: new Date('2024-10-16 11:30:05'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'papa_yuda',
          email: 'yudasntoso@gmail.com',
          password: '$2b$10$NsOGO8m5i1if.gBeXKvJyeDf9JvabjXmug10lckg1T6kymrpCyhZ.',
          joinDate: new Date('2024-10-15 17:30:17'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'troublemaker7417',
          email: 'widisari@gmail.com',
          password: '$2b$10$ap8fJ7e1EcgAsuqQ7XpgcOREwNxpmoKcnashn19vLiEI6oAkiFicW',
          joinDate: new Date('2024-10-16 19:37:36'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'sleepy_morning_glory',
          email: 'vunanrsita@gmail.com',
          password: '$2b$10$vkp.fkVN6dZNU0qzETbSIeTiNzbY6n3Sj02HCsTvdkBpQSgPx.MQq',
          joinDate: new Date('2024-10-18 08:44:46'),
          saldo: 0,
          countryRef: 112
        },
        {
          role: 'normal',
          displayName: 'ChickenNugget',
          email: 'hilmiakbar@gmail.com',
          password: '$2b$10$pTGOaw1vr1xYKbMrr8ZujemZTzVfhzZ1wt5i7ev5z4f2Cc61gwvzy',
          joinDate: new Date('2024-10-18 06:09:31'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'moonlit.karima',
          email: 'karimalhakim@gmail.com',
          password: '$2b$10$BNc7M.Xzf4mc90pNIl09Ne9kl6jVhAF3ZseOcVvRaEGCyrmKyP7fW',
          joinDate: new Date('2024-10-15 01:33:04'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'udasptrraa',
          email: 'udasptrraa@gmail.com',
          password: '$2b$10$q7zVc0OBRnBA5arPTFUG6.C9.XwFEscsqg6GB2ePvMtv3fMRW6W3O',
          joinDate: new Date('2024-10-17 23:09:33'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'honeybee',
          email: 'tinorhman@gmail.com',
          password: '$2b$10$AF/.yfcantTBCAcpVMzCvuf1VhOWxo1ZoWSZaDjBjWRigP3/d.FLS',
          joinDate: new Date('2024-10-18 04:47:48'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Eriri',
          email: 'eriwinarni@gmail.com',
          password: '$2b$10$fKop3OtGtWU/rv2tydBK2Ox16QBG4lrQNZ/MbgctQM0ECoYAW8igO',
          joinDate: new Date('2024-10-16 16:07:15'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SweetNSour',
          email: 'hidayatrohmad01@gmail.com',
          password: '$2b$10$xPnd4TdTVTvGwRnRYGk2suiA/SUvpxIIzmmJG4wmIsTkCECA0n7qu',
          joinDate: new Date('2024-10-14 04:26:19'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'career.shintapramesti',
          email: 'shintapmesti@gmail.com',
          password: '$2b$10$snrfaSFE.ivR1A93fi06reabhCbQBNPIbEqfKtpDsbicR8Gg/fY2i',
          joinDate: new Date('2024-10-18 01:59:06'),
          saldo: 0,
          countryRef: 100
        },
        {
          role: 'normal',
          displayName: 'cutebabybearr',
          email: 'ikmaanisa@gmail.com',
          password: '$2b$10$nen/O635gRQpN4VRncjL0OVboOW5Heiur6N9RFIQEPOKOUfdxM7Ai',
          joinDate: new Date('2024-10-14 04:25:46'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'your.queen.shinta',
          email: 'ratushnta@gmail.com',
          password: '$2b$10$dyp1WHA5H9k4z4mn/oyk3O.XaHADbfssQUtHrRxudv0QMfB6ZKvHO',
          joinDate: new Date('2024-10-18 14:55:59'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Kopi Tubruk',
          email: 'rudihartono@gmail.com',
          password: '$2b$10$myoca5QUtZBXy2vHEfHKveNIDOdNGcYbm6SbFfbBubpoDl61fLal6',
          joinDate: new Date('2024-10-16 03:32:43'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'vicoamr',
          email: 'vicoamr@gmail.com',
          password: '$2b$10$xxbW6.f0kjB3NL46ltqYTeqMmVjz/tAzyqzavKCm.xL6MVtJ50dru',
          joinDate: new Date('2024-10-15 17:23:30'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'princess_ani',
          email: 'aninsetyaputri@gmail.com',
          password: '$2b$10$qOTb3nSNw0OAA2M4AKKB7ufwOIGfk7S0oF2dSwY6ruFPi19hrj/8a',
          joinDate: new Date('2024-10-14 13:45:31'),
          saldo: 0,
          countryRef: 112
        },
        {
          role: 'normal',
          displayName: 'bukanoki',
          email: 'okiptrass@gmail.com',
          password: '$2b$10$x.4NIeTtdHAhTWNvQnaAD.8idXQdXVYphge0ddK2rCQZMcbuFJY8S',
          joinDate: new Date('2024-10-15 04:53:46'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Tango28',
          email: 'budiraharjo@gmail.com',
          password: '$2b$10$H9fo1HWnCwmwMM/rIM1zDOs.E1Fjqjf7RZhcEOKvxvKAtTJXz4eMO',
          joinDate: new Date('2024-10-12 17:16:50'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'raini.nia',
          email: 'nianraini@gmail.com',
          password: '$2b$10$zJq.G7xZ2KeWCbqDOC/Q9e0Y2JUTKxBg/UgrXwWtpfVWKC3.JZreu',
          joinDate: new Date('2024-10-17 05:54:04'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'chocobanana',
          email: 'mitarhrjo@gmail.com',
          password: '$2b$10$vuhUv9P/aqd/AbD/jX.5kuBBVIk4Eww4hRVvO0j4nV3hsKB6OnPaG',
          joinDate: new Date('2024-10-13 13:30:35'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'only_indahsetyawati',
          email: 'indahsetyawati@gmail.com',
          password: '$2b$10$FBxEXl1cExM3WhhWJf4.j.pnYt45UTRzRhjhdnD6CvRZQqfaP/pyC',
          joinDate: new Date('2024-10-17 06:06:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'pohon_pisang',
          email: 'ikmalahmad@gmail.com',
          password: '$2b$10$bFyt/k1bBYL4v63CNAAtWeUlMvARsyFld.s40kmHUlZuW7WMGVCFq',
          joinDate: new Date('2024-10-16 10:46:23'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Haidar',
          email: 'haidarsalman@gmail.com',
          password: '$2b$10$3nUadps0/8K3r9KXmZ5OaefRcoKfPjhYQlW69sgt.DpElRvHxkiAy',
          joinDate: new Date('2024-10-13 00:22:04'),
          saldo: 0,
          countryRef: 13
        },
        {
          role: 'normal',
          displayName: 'jokoprstyo',
          email: 'jokoprstyo@gmail.com',
          password: '$2b$10$BoP5Qnn8yAwk5t/KtAEi3eIi3XjzkANBve7ZRj9HGEyStB2kngLjy',
          joinDate: new Date('2024-10-17 12:16:12'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'little.mermaid',
          email: 'ichaandani@gmail.com',
          password: '$2b$10$YaYZJgYR91mVMwjHMAk4zOWhnQ0TJcY0p6tdj2RjLki/nYSD7SbN6',
          joinDate: new Date('2024-10-13 12:39:16'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'familytinywiny',
          email: 'intanputri@gmail.com',
          password: '$2b$10$Qh9IEcM59Wmc6jmrD6UB2OQ12z6zGwVTXKop/eYEUS6xR4GOwhMLO',
          joinDate: new Date('2024-10-17 02:09:22'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'hendra.w',
          email: 'hendrawjaya@gmail.com',
          password: '$2b$10$AW8ZMt6uM7S3hnP0U9vNL.7NJs7XxwATsIx2xxEh9Kj4t.rHIVpAa',
          joinDate: new Date('2024-10-16 07:14:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'LiraVale',
          email: 'nurulhidayati@gmail.com',
          password: '$2b$10$MzbKsXI.RXiK6vlptXjgwO.qTrzccFH8LcqIQdJ5Agc9/HN5riAe6',
          joinDate: new Date('2024-10-15 09:20:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'vellichor',
          email: 'galuhprnama@gmail.com',
          password: '$2b$10$BWa20Lye817kT3DJgV8DkOQjLkPto7z3zvbESR9ZYEiWdxAbdvPVS',
          joinDate: new Date('2024-10-15 10:34:07'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Adi2000',
          email: 'haryadipramana@gmail.com',
          password: '$2b$10$D49AQS19pwV/nj2.mnJOae54xyEzu/EOxzAxNwXdg.RIqdb9/CSAC',
          joinDate: new Date('2024-10-12 23:46:43'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Zulu2555',
          email: 'fahminur5@gmail.com',
          password: '$2b$10$C/vr.u.y0WPVYhtW0isize1P5v6RxcqQj8ZSpzJYf4kqIK5egVapS',
          joinDate: new Date('2024-10-17 11:51:09'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Eja Oranata',
          email: 'ejaoranata@gmail.com',
          password: '$2b$10$Ywu8a6RCG3ilL3TgF.mZGu42rq.ZRloK3oWC.5zW6X1YXEX8SInXq',
          joinDate: new Date('2024-10-13 20:15:33'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Deni57',
          email: 'denialamsyah@gmail.com',
          password: '$2b$10$XpaVPp./QFmw8wZdcQPbTutoUrg3bC5EVeOO5RevRfFTlxo7sbFgy',
          joinDate: new Date('2024-10-15 06:12:44'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Solstice',
          email: 'sultonahmad@gmail.com',
          password: '$2b$10$FnzjVUgcxqA2Br9rFPKJd.ZvjxFWodh63qTXcij4TUbAfW2U6BQMa',
          joinDate: new Date('2024-10-13 12:34:17'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'queen_cintya',
          email: 'cintyamlati@gmail.com',
          password: '$2b$10$zKyErrPXtBcM5bd9.L8yZupDdHlKd2MEdZ8Bx55kNSX1qKvz12eWC',
          joinDate: new Date('2024-10-13 00:50:09'),
          saldo: 0,
          countryRef: 200
        },
        {
          role: 'normal',
          displayName: 'sonyeondans',
          email: 'nurmaajeng@gmail.com',
          password: '$2b$10$2nt5lkNMmIdm2IXDzgwBfeAsN2/Uj2EH6MMBvruB94zhR43uIbmse',
          joinDate: new Date('2024-10-16 08:05:26'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'indomi.goreng.rendang',
          email: 'budisntika@gmail.com',
          password: '$2b$10$t2Noy6u3uQ.N9Nq.zwujhONFqYxmMLiqmuTygXXShwuNpKnx70E3C',
          joinDate: new Date('2024-10-16 15:49:58'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'moon.moonwalk',
          email: 'haryantosetiawan@gmail.com',
          password: '$2b$10$FHyN2SWuWDzIcTAhjmSQXulwke10nfbv4xTwrUcc7VTv96HqsRbKy',
          joinDate: new Date('2024-10-13 21:40:01'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'yunasmile',
          email: 'hasbiamrullah@gmail.com',
          password: '$2b$10$AYe04Aq/s14tfp5bkzINyem9KVQklhrB4Ug5stF0aoxu9ruAmN562',
          joinDate: new Date('2024-10-13 20:59:14'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'shaquille.oatmeal',
          email: 'adingroho@gmail.com',
          password: '$2b$10$fgvlBKm.nauaILo6auLoreNn2MidL6Fg/.gETcqGhLpldzbC27NNe',
          joinDate: new Date('2024-10-12 23:14:11'),
          saldo: 0,
          countryRef: 13
        },
        {
          role: 'normal',
          displayName: 'smolstan',
          email: 'katrindiana@gmail.com',
          password: '$2b$10$/4wqRnpko.gKVcTco4d4n.CnBJlun/bscAwbQnag464DJcDkFtbiW',
          joinDate: new Date('2024-10-15 18:17:28'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'yanazlkifli',
          email: 'yanazlkifli@gmail.com',
          password: '$2b$10$/aiDiUmFjnhj5mqHexoIvOaawNMM.W1ZcnNn0JoZqKoGgBFzzDd06',
          joinDate: new Date('2024-10-14 11:34:28'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Wishkey69',
          email: 'wiramrdiyah@gmail.com',
          password: '$2b$10$IyurynNuTZIKlA2mluE3Fe3K6pgIp3TpAo5HjUgMglqvYofWty3ke',
          joinDate: new Date('2024-10-13 01:34:32'),
          saldo: 0,
          countryRef: 45
        },
        {
          role: 'normal',
          displayName: 'Casanova',
          email: 'vidiamra@gmail.com',
          password: '$2b$10$iW/Jeb52LVCPAqupEuovne5Bpy6XS0rp8SnoNURkcXRFBrXRo69Mq',
          joinDate: new Date('2024-10-17 14:15:19'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'umilstri',
          email: 'umilstri@gmail.com',
          password: '$2b$10$imOlK5WugDmW5atr2ZSv6eeACT.YKWwQ7tg/xb.eCA8RrDEVnsqDS',
          joinDate: new Date('2024-10-14 23:46:18'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'hiddeninsom4eternity',
          email: 'taniadwi@gmail.com',
          password: '$2b$10$NP/fcTNHYEAyLjC57gSpWOu2zGEcpfFxs6iBeerAnvEAYTPEvGil.',
          joinDate: new Date('2024-10-14 10:54:39'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'bang.bang.bang_killingme',
          email: 'rahmatfjri@gmail.com',
          password: '$2b$10$EqvxcL8L9HILu5tAde5o8ui.t8R7kYk4nXqfWCwm.SqzP1KRQ8vHm',
          joinDate: new Date('2024-10-15 23:15:56'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Vini',
          email: 'viniarfin@gmail.com',
          password: '$2b$10$GUa8RAryGkRwqIhlyz94OOM1NIVybvJ5RwFgyny1Ki8CyMVg2G042',
          joinDate: new Date('2024-10-15 00:46:06'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Okari',
          email: 'okariana@gmail.com',
          password: '$2b$10$2HurspSaQ5F3fTlrlT3n/.lFT.JQDObPjqkvhqcvo9RanDaK/L1eC',
          joinDate: new Date('2024-10-16 02:40:45'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'rosmidasari51',
          email: 'rosmidasari51@gmail.com',
          password: '$2b$10$4h.kLDi56lJKV4aBIfKGoOcry41ObFj8b3Hx2vPm5tr78i4rQcVXC',
          joinDate: new Date('2024-10-15 05:17:38'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'wistfulwisteria',
          email: 'ratnadwiana@gmail.com',
          password: '$2b$10$LWaK39UOhhYtdyMxhCYHS.ybjHcUyAlWAMZgJmtu4AQyN6Pdj15om',
          joinDate: new Date('2024-10-16 01:40:46'),
          saldo: 0,
          countryRef: 134
        },
        {
          role: 'normal',
          displayName: 'LuminescentLuxe',
          email: 'marlinasukma@gmail.com',
          password: '$2b$10$S6za.2CuRem0II2ly0w1wupzHMqkhDq4TxBoe8pqO3Tr/B6qq/rSS',
          joinDate: new Date('2024-10-16 10:41:01'),
          saldo: 0,
          countryRef: 236
        },
        {
          role: 'normal',
          displayName: 'Alpha77',
          email: 'faridhardja@gmail.com',
          password: '$2b$10$0ZibKf2TJoS.2u4Sn1uIbOSuFK.GGozG094izLxfP.MTjQ54QN1Oy',
          joinDate: new Date('2024-10-17 15:44:22'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'MystiqueMingle',
          email: 'andreantoni@gmail.com',
          password: '$2b$10$Djby/s6ReOl6mf0lzvkC8.yWdlGR9jKPJhGLq9bvlke5SISDYU6ta',
          joinDate: new Date('2024-10-14 01:59:00'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'Brian',
          email: 'hasanbriansah@gmail.com',
          password: '$2b$10$ceOuJyAxKCNIMc/yYspkD.7hOM1QtJpjYy3wB3Y35SmuzAFLRklPK',
          joinDate: new Date('2024-10-14 18:47:47'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'SmokeAndFire',
          email: 'mahdirayyan@gmail.com',
          password: '$2b$10$kO/7GsVT2GbZOo.wcL3FhOmItX11U8vC/TiKqq1E65850bBRy0Hn2',
          joinDate: new Date('2024-10-18 08:15:45'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'harris',
          email: 'harrisnasir@gmaio.com',
          password: '$2b$10$R9lpvozVzOr2uDdo8RhX6.1C6DKysN8zs2Hb64W3c37ZENT8cfPQu',
          joinDate: new Date('2024-10-16 13:23:27'),
          saldo: 0,
          countryRef: 104
        },
        {
          role: 'normal',
          displayName: 'mosess88',
          email: 'mosessadarma@gmail.com',
          password: '$2b$10$QoQMTh3VaoalucrAgsTibO2p5f2.LmxtnIETibABi.iwy2tdZQEjq',
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
