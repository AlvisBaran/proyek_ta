import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import UsersWalletHistory from '@/backend/models/userswallethistory'

/**
 * Create a Wallet History
 *
 * Adalah fungsi untuk create wallet history user.
 *
 * @param {object} t Transaction object by sequelize
 * @param {number} userRef Id user
 * @param {number} nominal Nominal pembayaran
 * @param {string} type Enum dari [in, out]
 * @param {string} title Judul history
 * @param {string} description Deskripsi history
 * @param {string|undefined} mt_transaction_id Kalau pakai midtrans
 * @param {string|undefined} mt_order_id Kalau pakai midtrans
 */
export async function createUserWalletHistory(
  t,
  userRef,
  nominal,
  type,
  title,
  description,
  mt_transaction_id,
  mt_order_id
) {
  return new Promise(async (resolve, reject) => {
    // * Cek user ada
    const currUser = await User.findByPk(userRef)
    if (!currUser) {
      return reject({ message: responseString.USER.NOT_FOUND })
    }

    // * Cek type adalah in dan out
    if (!['in', 'out'].includes(type)) {
      return reject({ message: 'Type tidak valid!' })
    }

    // * Build Data
    const newWalletHistory = UsersWalletHistory.build({
      userRef,
      nominal,
      type,
      title,
      description,
      mt_transaction_id,
      mt_order_id
    })

    // * Insert DB
    return resolve({ walletHistory: await newWalletHistory.save({ transaction: t }) })
  })
}
