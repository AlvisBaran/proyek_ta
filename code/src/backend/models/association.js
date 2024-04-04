import User from './user'
import Reply from './reply'
import Content from './content'
import Comment from './comment'
import Notification from './notification'
import ContentLikes from './contentlikes'
import TransTopup from './transtopup'
import Membership from './membership'
import MembershipsXContents from './membershipsxcontents'
import Category from './category'
import CategoriesXContents from './categoriesxcontents'

// ** User and Notifications
User.hasMany(Notification, { foreignKey: 'userRef' })
Notification.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Content
User.hasMany(Content, { foreignKey: 'creatorRef', as: 'Creator' })
Content.belongsTo(User, { foreignKey: 'creatorRef', as: 'Creator' })

// ** Content and Comment
Content.hasMany(Comment, { foreignKey: 'contentRef' })
Comment.belongsTo(Content, { foreignKey: 'contentRef' })

// ** Comment and Reply
Comment.hasMany(Reply, { foreignKey: 'commentRef' })
Reply.belongsTo(Comment, { foreignKey: 'commentRef' })

// ** User and Comment
User.hasMany(Comment, { foreignKey: 'authorRef' })
Comment.belongsTo(User, { foreignKey: 'authorRef' })

// ** User and Reply
User.hasMany(Reply, { foreignKey: 'authorRef' })
Reply.belongsTo(User, { foreignKey: 'authorRef' })

// ** Content and Content Likes
Content.hasMany(ContentLikes, { foreignKey: 'contentRef' })
ContentLikes.belongsTo(Content, { foreignKey: 'contentRef' })

User.hasMany(ContentLikes, { foreignKey: 'performerRef' })
ContentLikes.belongsTo(User, { foreignKey: 'performerRef' })

// ** User and Trans Topup
User.hasMany(TransTopup, { foreignKey: 'userRef' })
TransTopup.belongsTo(User, { foreignKey: 'userRef' })

// ** Membership and Content: Many to Many
Membership.belongsToMany(Content, { through: MembershipsXContents, foreignKey: 'membershipRef' })
Content.belongsToMany(Membership, { through: MembershipsXContents, foreignKey: 'contentRef' })
Membership.hasMany(MembershipsXContents, { foreignKey: 'membershipRef' })
MembershipsXContents.belongsTo(Membership, { foreignKey: 'membershipRef' })
Content.hasMany(MembershipsXContents, { foreignKey: 'contentRef' })
MembershipsXContents.belongsTo(Content, { foreignKey: 'contentRef' })

// ** Category and Content: Many to Many
Category.belongsToMany(Content, { through: CategoriesXContents, foreignKey: 'categoryRef' })
Content.belongsToMany(Category, { through: CategoriesXContents, foreignKey: 'contentRef' })
Category.hasMany(CategoriesXContents, { foreignKey: 'categoryRef' })
CategoriesXContents.belongsTo(Category, { foreignKey: 'categoryRef' })
Content.hasMany(CategoriesXContents, { foreignKey: 'contentRef' })
CategoriesXContents.belongsTo(Content, { foreignKey: 'contentRef' })
