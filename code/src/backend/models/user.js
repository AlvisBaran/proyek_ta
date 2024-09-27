'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class User extends Model {}

// async function hash(obj) {
//   return await bcrypt.hash(obj).then(hash => hash)
// }

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cUsername: {
      type: DataTypes.STRING,
      unique: true
    },
    role: {
      type: DataTypes.ENUM,
      values: ['normal', 'admin', 'creator'],
      defaultValue: 'normal',
      allowNull: false
    },
    saldo: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    banStatus: {
      type: DataTypes.ENUM,
      values: ['clean', 'banned', 'unbanned'],
      defaultValue: 'clean',
      allowNull: false
    },
    bannedDate: DataTypes.DATE,
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    displayName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      // INFO: Ini encryption
      type: DataTypes.TEXT('tiny')
      // async set(value) {
      //   this.setDataValue('password', await hash(value))
      // }
      // get() { // Gatau kenapa ga bekerja
      //   const rawValue = this.getDataValue('password');
      //   return rawValue ? rawValue.toUpperCase() : null;
      // },
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    socials: DataTypes.TEXT,
    bio: DataTypes.TEXT,
    about: DataTypes.TEXT,
    banner: {
      type: DataTypes.STRING
    },
    themeColor: {
      type: DataTypes.STRING,
      defaultValue: '#eee',
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize: sqlz,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'joinDate',
    updatedAt: false,
    paranoid: true
  }
)

export default User
