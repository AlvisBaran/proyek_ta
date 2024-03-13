import User from "./user"
import Reply from "./reply"
import Content from "./content"
import Comment from "./comment"
import Notification from "./notification"
import ContentLikes from "./contentlikes"
import TransTopup from "./transtopup"

User.hasMany(Notification, { foreignKey: "userRef" })
Notification.belongsTo(User, { foreignKey: "userRef" })

User.hasMany(Content, { foreignKey: "creatorRef", as: "Creator" })
Content.belongsTo(User, { foreignKey: "creatorRef", as: "Creator" })

Content.hasMany(Comment, { foreignKey: "contentRef" })
Comment.belongsTo(Content, { foreignKey: "contentRef" })

Comment.hasMany(Reply, { foreignKey: "commentRef" })
Reply.belongsTo(Comment, { foreignKey: "commentRef" })

User.hasMany(Comment, { foreignKey: "authorRef" })
Comment.belongsTo(User, { foreignKey: "authorRef" })

User.hasMany(Reply, { foreignKey: "authorRef" })
Reply.belongsTo(User, { foreignKey: "authorRef" })

Content.hasMany(ContentLikes, { foreignKey: "contentRef" })
ContentLikes.belongsTo(Content, { foreignKey: "contentRef" })

User.hasMany(ContentLikes, { foreignKey: "performerRef" })
ContentLikes.belongsTo(User, { foreignKey: "performerRef" })

User.hasMany(TransTopup, { foreignKey: "userRef" })
TransTopup.belongsTo(User, { foreignKey: "userRef" })