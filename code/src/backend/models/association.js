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
import ContentGallery from './contentgallery'
import UsersFollows from './usersfollows'
import ContentRequest from './contentrequest'
import ContentRequestMember from './contentrequestmember'
import ContentRequestPayment from './contentrequestpayment'
import UsersWalletHistory from './userswallethistory'
import UserMembershipPurchase from './usermembershippurchase'
import Bank from './bank'
import TransWithdraw from './transwithdraw'
import AccountUpgradeRequests from './accountupgraderequests'
import Message from './message'
import Chat from './chat'
import Country from './country'
import ContentUniqueViews from './contentuniqueviews'

// ** Country and User
Country.hasMany(User, { foreignKey: 'countryRef' })
User.belongsTo(Country, { foreignKey: 'countryRef' })

// ** User and Notifications
User.hasMany(Notification, { foreignKey: 'userRef' })
Notification.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Content
User.hasMany(Content, { foreignKey: 'creatorRef', as: 'Creator' })
Content.belongsTo(User, { foreignKey: 'creatorRef', as: 'Creator' })

// ** User and ContentUniqueViews
User.hasMany(ContentUniqueViews, { foreignKey: 'userRef' })
ContentUniqueViews.belongsTo(User, { foreignKey: 'userRef' })

// ** Content and Gallery
Content.hasMany(ContentGallery, { foreignKey: 'contentRef', as: 'Gallery' })
ContentGallery.belongsTo(Content, { foreignKey: 'contentRef', as: 'Gallery' })

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

// ** User and Content Likes
User.hasMany(ContentLikes, { foreignKey: 'performerRef' })
ContentLikes.belongsTo(User, { foreignKey: 'performerRef' })

// ** User and Trans Topup
User.hasMany(TransTopup, { foreignKey: 'userRef' })
TransTopup.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Membership
User.hasMany(Membership, { foreignKey: 'userRef' })
Membership.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Message
User.hasMany(Message, { foreignKey: 'user1Ref', as: 'User1' })
Message.belongsTo(User, { foreignKey: 'user1Ref', as: 'User1' })
User.hasMany(Message, { foreignKey: 'user2Ref', as: 'User2' })
Message.belongsTo(User, { foreignKey: 'user2Ref', as: 'User2' })

// ** Message and Chat
Message.hasMany(Chat, { foreignKey: 'messageRef' })
Chat.belongsTo(Message, { foreignKey: 'messageRef' })

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

// ** User and User (Follow): Many to Many
User.belongsToMany(User, { through: UsersFollows, foreignKey: 'followerRef', as: 'Follower' })
User.belongsToMany(User, { through: UsersFollows, foreignKey: 'followedRef', as: 'Followed' })
User.hasMany(UsersFollows, { foreignKey: 'followerRef' })
UsersFollows.belongsTo(User, { foreignKey: 'followerRef' })
User.hasMany(UsersFollows, { foreignKey: 'followedRef' })
UsersFollows.belongsTo(User, { foreignKey: 'followedRef' })

// ** User and Content Request
User.hasMany(ContentRequest, { foreignKey: 'applicantRef', as: 'ContentRequestor' })
ContentRequest.belongsTo(User, { foreignKey: 'applicantRef', as: 'ContentRequestor' })
User.hasMany(ContentRequest, { foreignKey: 'creatorRef', as: 'ContentCreator' })
ContentRequest.belongsTo(User, { foreignKey: 'creatorRef', as: 'ContentCreator' })

// ** Content and Content Request
Content.hasMany(ContentRequest, { foreignKey: 'contentRef' })
ContentRequest.belongsTo(Content, { foreignKey: 'contentRef' })

// ** Content Request and Content Request Member
ContentRequest.hasMany(ContentRequestMember, { foreignKey: 'contentRequestRef' })
ContentRequestMember.belongsTo(ContentRequest, { foreignKey: 'contentRequestRef' })

// ** Content Request Member and User
User.hasMany(ContentRequestMember, { foreignKey: 'userRef' })
ContentRequestMember.belongsTo(User, { foreignKey: 'userRef' })

// ** Content Request and Content Request Payment
ContentRequest.hasMany(ContentRequestPayment, { foreignKey: 'contentRequestRef' })
ContentRequestPayment.belongsTo(ContentRequest, { foreignKey: 'contentRequestRef' })

// ** Content Request Payment and User
User.hasMany(ContentRequestPayment, { foreignKey: 'userRef' })
ContentRequestPayment.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Wallet History
User.hasMany(UsersWalletHistory, { foreignKey: 'userRef' })
UsersWalletHistory.belongsTo(User, { foreignKey: 'userRef' })

// ** Membership and Membership Purchase
Membership.hasMany(UserMembershipPurchase, { foreignKey: 'membershipRef' })
UserMembershipPurchase.belongsTo(Membership, { foreignKey: 'membershipRef' })

// ** User and Membership Purchase
User.hasMany(UserMembershipPurchase, { foreignKey: 'userRef' })
UserMembershipPurchase.belongsTo(User, { foreignKey: 'userRef' })

// ** Bank and Withdraw
Bank.hasMany(TransWithdraw, { foreignKey: 'bankRef' })
TransWithdraw.belongsTo(Bank, { foreignKey: 'bankRef' })

// ** User and Withdraw
User.hasMany(TransWithdraw, { foreignKey: 'userRef' })
TransWithdraw.belongsTo(User, { foreignKey: 'userRef' })

// ** User and Account Upgrade Requests
User.hasMany(AccountUpgradeRequests, { foreignKey: 'applicantRef', as: 'Applicant' })
AccountUpgradeRequests.belongsTo(User, { foreignKey: 'applicantRef', as: 'Applicant' })
User.hasMany(AccountUpgradeRequests, { foreignKey: 'adminRef', as: 'Admin' })
AccountUpgradeRequests.belongsTo(User, { foreignKey: 'adminRef', as: 'Admin' })
