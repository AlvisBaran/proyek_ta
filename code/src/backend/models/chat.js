'use strict'
import { Model, DataTypes, literal } from 'sequelize'
import sqlz from '../configs/db'

class Chat extends Model {}

Chat.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    messagesRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users_messages', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    authorRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  },
  {
    sequelize: sqlz,
    modelName: 'Chat',
    tableName: 'users_messages_chats',
    updatedAt: false
  }
)

export default Chat
