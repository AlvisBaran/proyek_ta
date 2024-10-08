export const responseString = {
  GLOBAL: {
    SUCCESS: 'Aktivitas berhasil!',
    FAILED: 'Aktivitas gagal!',
    UNFINISHED_SERVICE: 'Mohon maaf, service ini belum dapat dipakai.',
    NOT_FOUND: 'Item yang anda cari tidak ditemukan!',
    ADD_FAILED: 'Gagal menambah item ke database!',
    UPDATE_FAILED: 'Gagal melakukan pembaruan data!',
    ALREADY_EXISTS: 'Item yang ingin anda tambahkan sudah pernah ada!',
    DELETE_FAILED: 'Gagal menghapus item!',
    FORBIDDEN: 'Route ini adalah area terlarang untuk anda!',
    TRANSACTION_ERROR: 'Gagal saat transaksi database!'
  },
  VALIDATION: {
    ERROR: 'Input yang diberi tidak lolos validasi!',
    NOTHING_CHANGE_ON_UPDATE: 'Tidak ada atribut yang berubah!'
  },
  SERVER: {
    AUTH_ERROR: 'Terjadi kesalahan pada server bagian firebase authentication!',
    SERVER_ERROR: 'Terjadi kesalahan pada server!'
  },
  USER: {
    NOT_FOUND: 'User tidak ditemukan!',
    EMAIL_USED: 'Email sudah pernah terdaftar sebelumnya!',
    ADD_FAILED: 'Gagal menambahkan user!',
    UPDATE_SUCCESS: 'Berhasil membarui user!',
    UPDATE_FAILED: 'Gagal membarui user!',
    DELETE_FAILED: 'Gagal menghapus user!',
    INUFICENT_BALANCE: 'Saldo tidak cukup untuk melakukan transaksi!',
    NOT_ADMIN: 'User bukan admin!',
    NOT_CREATOR: 'User bukan creator!',
    CHANGE_PASSWORD_SUCCESS: 'Berhasil mengganti password!\nLogin selanjutnya akan menggunakan password yang baru!'
  },
  CREATOR: {
    NOT_FOUND: 'Creator tidak ditemukan!'
  },
  MESSAGING: {
    ROOM_NOT_FOUND: 'Chat room tidak ditemukan!',
    ROOM_ALREADY_EXISTS: 'Chat room yang ingin anda tambahkan sudah pernah ada!',
    ROOM_ADD_FAILED: 'Gagal menambah chat room!',
    ROOM_DELETE_FAILED: 'Gagal menghapus chat room!',
    CHAT_ADD_FAILED: 'Gagal menghapus chat pada room tersebut!',
    ROOM_NOT_OWNED_BY_USER: 'Chat room ini bukan milik anda!'
  },
  CONTENT: {
    NOT_FOUND: 'Content tidak ditemukan atau dilarang!',
    ADD_FAILED: 'Gagal menambahkan content!',
    UPDATE_FAILED: 'Gagal membarui content!',
    DELETE_FAILED: 'Gagal menghapus content!'
  },
  CONTENT_REQUEST: {
    NOT_FOUND: 'Content request tidak ditemukan!',
    NOT_REQUESTED_BY_USER: 'Content request tidak dimiliki oleh user tersebut!',
    NOT_WAITING_REQUESTOR_CONFIRMATION: 'Content request tidak dalam status menunggu konfirmasi requestor!',
    NOT_WAITING_PAYMENT: 'Content request tidak dalam status menerima pembayaran!',
    NOT_A_MEMBER: 'User bukan salah satu member!',
    STATUS_ERROR: 'Status tidak sesuai!',
    EXIST_PAYMENTS: 'Sudah ada payment yang dibuat!',
    PAYMENT_OVERPAID: 'Nominal pembayaran berlebih!'
  },
  MEMBERSHIP: {
    NOT_FOUND: 'Membership tidak ditemukan!'
  }
}
