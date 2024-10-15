import Joi from 'joi'
import { mainBucketName, minioClient } from '@/minio/config'
import { responseString } from '@/backend/helpers/serverResponseString'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'

import sqlz from '@/backend/configs/db'
import User from '@/backend/models/user'
import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'
import ContentShares from '@/backend/models/contentshares'
import Comment from '@/backend/models/comment'
import Reply from '@/backend/models/reply'
import Category from '@/backend/models/category'
import UsersFollows from '@/backend/models/usersfollows'
import ContentUniqueViews from '@/backend/models/contentuniqueviews'

import '@/backend/models/association'

// ** User > Content > Get One Content
export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams
  const withComments = searchParams.get('noComments') ? false : true
  const withReplies = searchParams.get('noReplies') ? false : true
  const withGalleries = searchParams.get('noGalleries') ? false : true
  let sharerUserId = searchParams.get('sharerUserId') ?? null
  const { contentId } = response.params
  let res = {}

  // * Cek user ada
  const { user, error } = await getUserFromServerSession(request, response)
  if (!!error) {
    res = { message: error.message }
    return Response.json(res, { status: error.code })
  }

  const joiValidate = Joi.object({
    contentId: Joi.number().required(),
    sharerUserId: Joi.number().allow(null)
  }).validate({ contentId, sharerUserId }, { abortEarly: false })

  if (!joiValidate.error) {
    // * Fetch content sekalian cek ada
    let include = [
      {
        model: User,
        as: 'Creator',
        attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture', 'banner', 'bio']
      }
    ]
    let order = []
    if (withComments) {
      order.push([Comment, 'createdAt', 'DESC'])
      let commentInclude = [
        {
          model: User,
          attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
        }
      ]
      if (withReplies) {
        order.push([Comment, Reply, 'createdAt', 'ASC'])
        commentInclude.push({
          model: Reply,
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: {
            model: User,
            attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
          }
        })
      }
      include.push({
        model: Comment,
        attributes: ['id', 'content', 'createdAt', 'updatedAt'],
        include: commentInclude
      })
    }
    if (withGalleries) {
      include.push({
        model: ContentGallery,
        as: 'Gallery'
      })
      order.push(['Gallery', 'createdAt', 'ASC'])
    }
    include.push({ model: Category })

    let currContent = await Content.findOne({
      where: { id: contentId },
      include,
      order
    })
    if (!currContent) {
      res = { message: responseString.GLOBAL.NOT_FOUND }
      return Response.json(res, { status: 404 })
    }

    // * Cek content public or private
    if (currContent.type === 'private') {
      // * -> kalo private dan user login ga ada return
      if (!user) {
        res = { message: responseString.GLOBAL.FORBIDDEN, error: 'FORBIDDEN!' }
        return Response.json(res, { status: 403 })
      } else {
        // TODO: -> kalo private dan user login ada cek membershipnya
        // TODO: ---> kalo membership ga ada return
        // * ---> kalo ada ya lanjut
      }
    }
    // * -> kalo public ya udah next

    // ** Ini kalo ada sharer dan opener
    if (!!sharerUserId) {
      let currSharer = await User.findByPk(sharerUserId)
      if (!!currSharer && !!user) {
        try {
          await sqlz.transaction(async t => {
            // * Masukan ke db
            let newContentShares = ContentShares.build({
              contentRef: currContent.id,
              sharerRef: currSharer.id,
              openerRef: user.id
            })
            await newContentShares.save().catch(error => {
              throw new Error({ message: responseString.GLOBAL.FAILED, details: error })
            })
            // * Tambah counter sharer di content
            await currContent.increment('shareCounter', { by: 1 }).catch(error => {
              throw new Error({ message: responseString.GLOBAL.FAILED, details: error })
            })
          })
        } catch (error) {
          // * Kalo ada mau tambahan error handler bisa taruh sini
          console.info(error)
          // res = { error: { message: responseString.GLOBAL.FAILED }, details: error };
          // return Response.json(res, { status: 400 });
        }
      }
    }

    // * Menambah URL ke object Gallery
    const galleries = []
    if (withGalleries)
      for (let i = 0; i < currContent.Gallery.length; i++) {
        const currGallery = currContent.Gallery[i]
        // ** Mengambil setiap url dari object yang bersangkutan menggunakan object_name
        await minioClient
          .presignedGetObject(mainBucketName, currGallery.minio_object_name)
          .then(url => {
            galleries.push({
              ...currGallery.dataValues,
              url
            })
          })
          .catch(error => {
            console.error('minio ERROR: presignedGetObject', error)
          })
      }

    // * Menambah URL ke object User di Comments dan Replies
    const existingProfilePicture = []
    const comments = []
    if (withComments)
      for (let i = 0; i < currContent.Comments.length; i++) {
        const currComment = currContent.Comments[i]
        let profilePictureUrl = null

        if (!!currComment.User) {
          const existing = existingProfilePicture.find(item => item.id === currComment.User.id)
          if (!!existing) profilePictureUrl = existing.profilePictureUrl
          else {
            if (!!currComment.User.profilePicture)
              await minioClient
                .presignedGetObject(mainBucketName, currComment.User.profilePicture)
                .then(url => {
                  profilePictureUrl = url
                  existingProfilePicture.push({ id: currComment.User.id, profilePictureUrl: url })
                })
                .catch(error => {
                  console.error('minio ERROR: presignedGetObject', error)
                })
          }
        }

        // * Untuk replies
        const replies = []
        if (withReplies)
          for (let j = 0; j < currComment.Replies.length; j++) {
            const currReply = currComment.Replies[j]
            let profilePictureUrlReply = null

            if (!!currReply.User) {
              const existingReply = existingProfilePicture.find(item => item.id === currReply.User.id)
              if (!!existingReply) profilePictureUrlReply = existingReply.profilePictureUrl
              else {
                if (!!currReply.User.profilePicture)
                  await minioClient
                    .presignedGetObject(mainBucketName, currReply.User.profilePicture)
                    .then(url => {
                      profilePictureUrlReply = url
                      existingProfilePicture.push({ id: currReply.User.id, profilePictureUrl: url })
                    })
                    .catch(error => {
                      console.error('minio ERROR: presignedGetObject', error)
                    })
              }
            }

            replies.push({
              ...currReply.dataValues,
              User: {
                ...currReply.User.dataValues,
                profilePictureUrl: profilePictureUrlReply
              }
            })
          }

        comments.push({
          ...currComment.dataValues,
          User: {
            ...currComment.User.dataValues,
            profilePictureUrl
          },
          Replies: replies
        })
      }

    // * Mengambil profile picture creator
    let profilePictureUrlCreator = null
    if (!!currContent.Creator) {
      const existingCreator = existingProfilePicture.find(item => item.id === currContent.Creator.id)
      if (!!existingCreator) profilePictureUrlCreator = existingCreator.profilePictureUrl
      else {
        if (!!currContent.Creator.profilePicture)
          await minioClient
            .presignedGetObject(mainBucketName, currContent.Creator.profilePicture)
            .then(url => {
              profilePictureUrlCreator = url
              existingProfilePicture.push({ id: currContent.Creator.id, profilePictureUrl: url })
            })
            .catch(error => {
              console.error('minio ERROR: presignedGetObject', error)
            })
      }
    }

    // * Mengambil banner picture creator
    let bannerUrlCreator = null
    if (!!currContent.Creator && !!currContent.Creator.banner) {
      await minioClient
        .presignedGetObject(mainBucketName, currContent.Creator.banner)
        .then(url => {
          bannerUrlCreator = url
        })
        .catch(error => {
          console.error('minio ERROR: presignedGetObject', error)
        })
    }

    // * Get Creator Followed or Not
    const followed = await UsersFollows.findOne({
      where: { followerRef: user.id, followedRef: currContent.Creator.id }
    })

    // * Menambah jumlah view
    await Content.increment('viewCounter', { by: 1, where: { id: currContent.id } })

    // * Menambah jumlah unique views
    const existingContentUniqueViews = await ContentUniqueViews.findOne({
      where: { userRef: user.id, contentRef: currContent.id }
    })
    if (!existingContentUniqueViews) {
      const newContentUniqueViews = ContentUniqueViews.build({ userRef: user.id, contentRef: currContent.id })
      await newContentUniqueViews.save()
    }

    // * Mengambil jumlah unique views
    const uniqueViews = (await ContentUniqueViews.count({ where: { contentRef: currContent.id } })) ?? 0

    await currContent.reload()
    return Response.json(
      {
        ...currContent.dataValues,
        Creator: {
          ...currContent.Creator.dataValues,
          profilePictureUrl: profilePictureUrlCreator,
          bannerUrl: bannerUrlCreator,
          followed
        },
        Gallery: galleries,
        Comments: comments,
        uniqueViews
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
