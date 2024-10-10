import { responseString } from '@/backend/helpers/serverResponseString'
import Category from '@/backend/models/category'
import Content from '@/backend/models/content'
import ContentGallery from '@/backend/models/contentgallery'
import Membership from '@/backend/models/membership'
import User from '@/backend/models/user'
import Joi from 'joi'
import { Op } from 'sequelize'

import '@/backend/models/association'
import { mainBucketName, minioClient } from '@/minio/config'
import UsersFollows from '@/backend/models/usersfollows'

// ** Creator > Search
export async function POST(request) {
  let req = {}
  try {
    req = await request.json()
  } catch (e) {}
  let res = {}

  const joiValidate = Joi.object({
    keyword: Joi.string().required().allow(''),
    categoryIds: Joi.array().items(Joi.number()).optional(),
    membershipIds: Joi.array().items(Joi.number()).optional()
  }).validate({ ...req }, { abortEarly: false })

  if (!joiValidate.error) {
    const { keyword, categoryIds, membershipIds } = req
    // TODO: Ubah userId static ini jadi from user login
    const userId = 3

    let contents = []
    return await Content.findAll({
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'cUsername', 'displayName'],
          include: {
            model: UsersFollows,
            where: {
              followerRef: userId
            }
          }
        },
        {
          model: Category,
          where: !!categoryIds && categoryIds.length > 0 ? { id: { [Op.in]: categoryIds } } : undefined,
          attributes: ['id', 'label']
        },
        {
          model: Membership,
          where: !!membershipIds && membershipIds.length > 0 ? { id: { [Op.in]: membershipIds } } : undefined,
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ContentGallery,
          as: 'Gallery'
        }
      ],
      where: {
        status: 'published',
        [Op.or]: [{ title: { [Op.iLike]: `%${keyword}%` } }, { body: { [Op.iLike]: `%${keyword}%` } }]
      },
      order: [['createdAt', 'DESC']]
      // attributes: ['id', 'cUsername', 'role', 'banStatus', 'displayName', 'email', 'profilePicture']
    })
      .then(async (resps = []) => {
        const resp = resps.filter(item => !!item.Creator)
        for (let i = 0; i < resp.length; i++) {
          const datum = resp[i]
          const tempGallery = []
          for (let j = 0; j < datum.Gallery.length; j++) {
            const currGallery = datum.Gallery[j]
            await minioClient
              .presignedGetObject(mainBucketName, currGallery.minio_object_name)
              .then(url => {
                tempGallery.push({
                  ...currGallery.dataValues,
                  url
                })
              })
              .catch(error => {
                console.error('minio ERROR: presignedGetObject', error)
              })
          }
          contents.push({
            ...datum.dataValues,
            Gallery: tempGallery
          })
        }
        return Response.json(contents, { status: 200 })
      })
      .catch(err => {
        return Response.json({ message: responseString.SERVER.SERVER_ERROR, error: err }, { status: 500 })
      })
  } else {
    res = { message: responseString.VALIDATION.ERROR, error: joiValidate.error.details }
    return Response.json(res, { status: 400 })
  }
}
