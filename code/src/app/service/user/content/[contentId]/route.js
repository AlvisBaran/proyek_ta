import Joi from 'joi'
import Content from '@/backend/models/content'
import { responseString } from '@/backend/helpers/serverResponseString'
import User from '@/backend/models/user'
import Comment from '@/backend/models/comment'
import Reply from '@/backend/models/reply'
import '@/backend/models/association'
import ContentShares from '@/backend/models/contentshares'
import sqlz from '@/backend/configs/db'
import { getUserFromServerSession } from '@/backend/utils/sessionHandler'
import ContentGallery from '@/backend/models/contentgallery'
import { mainBucketName, minioClient } from '@/minio/config'

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
        attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
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
        order.push([Comment, Reply, 'createdAt', 'DESC'])
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
    }
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

    return Response.json(
      {
        ...currContent.dataValues,
        Gallery: galleries
      },
      { status: 200 }
    )
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
