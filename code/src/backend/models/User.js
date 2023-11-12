'use strict';
import { Model, DataTypes, literal } from 'sequelize';
import sqlz from '@/backend/configs/db';

export default class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate({ Notification }) {
    this.hasMany(Notification);
  }
}

function hash(obj) {
  return obj + "_hashed";
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cUsername: {
    type: DataTypes.STRING,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['normal', 'admin', 'creator'],
    defaultValue: 'normal',
    allowNull: false,
  },
  saldo: {
    // INFO: Ini encryption
    type: DataTypes.TEXT('tiny'),
    set(value) {
      this.setDataValue('saldo', hash(value));
    }
  },
  banStatus: {
    type: DataTypes.ENUM,
    values: ['clean', 'banned', 'unbanned'],
    defaultValue: 'clean',
    allowNull: false,
  },
  bannedDate: DataTypes.DATE,
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP'),
  },
  displayName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    // INFO: Ini encryption
    type: DataTypes.TEXT('tiny'),
    set(value) {
      this.setDataValue('password', hash(value));
    },
    // get() { // Gatau kenapa ga bekerja
    //   const rawValue = this.getDataValue('password');
    //   return rawValue ? rawValue.toUpperCase() : null;
    // },
    
  },
  
  profilePicture: DataTypes.TEXT('tiny'),
  socials: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  about: DataTypes.TEXT,
  banner: DataTypes.TEXT('tiny'),
  themeColor: {
    type: DataTypes.STRING,
    defaultValue: "#eee",
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE
  },
}, {
  sequelize: sqlz,
  modelName: 'User',
  tableName: "users",
  createdAt: "joinDate",
  updatedAt: false,
  paranoid: true,
});