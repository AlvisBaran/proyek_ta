'use client'

import { Fragment, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Divider,
  Grid,
  List,
  Pagination,
  Stack,
  Typography
} from '@mui/material'

import CategoryIcon from '@mui/icons-material/Category'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import UserPageLayout from '../../_components/layout'
import CommentListItem from './_components/CommentListItem'
import UserAddCommentForm from './_components/UserAddCommentForm'
import ShareDialog from './_components/ShareDialog'
import MoreActionMenu from './_components/MoreActionMenu'
import CreatorDisplayCard from './_components/CreatorDisplayCard'
import PopularContentsCard from './_components/PopularContentsCard'

import dayjs from 'dayjs'
import { formatDayMonth2 } from '@/utils/dayjsConst'

const contentDefaultValues = { data: null, loading: false, error: false, success: false }
const likeUnlikeDefaultValues = { loading: false, error: false, success: false }
const refetchCommentsDefaultValues = { loading: false, error: false, success: false }
const shareDialogDefaultValues = { open: false }

export default function UserContentDetail({ params }) {
  const contentId = params.id
  const router = useRouter()
  const searchParams = useSearchParams()
  const [content, setContent] = useState(contentDefaultValues)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [likeUnlike, setLikeUnlike] = useState(likeUnlikeDefaultValues)
  const [shareDialogValues, setShareDialogValues] = useState(shareDialogDefaultValues)
  const [refetchComments, setRefetchComments] = useState(refetchCommentsDefaultValues)
  console.log(content.data)
  // * Fetch Data
  async function fetchData() {
    setContent({ ...content, loading: true, error: false, success: false })
    if (!content.loading)
      await MyAxios.get(`/user/content/${contentId}`, {
        params: {
          sharerUserId: searchParams.get('sid') ?? undefined
        }
      })
        .then(resp => {
          setContent({ ...content, data: resp.data, loading: false, success: true })
        })
        .catch(err => {
          console.error(err)
          toast.error(`Failed to load content!\n${err.response.data.message}`)
          setContent({ ...content, data: null, loading: false, error: true })
          router.back()
        })
  }

  // * Fetch Comments
  async function fetchComments() {
    setRefetchComments({ ...refetchComments, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content/${contentId}/comment`)
      .then(resp => {
        setContent({ ...content, data: { ...content.data, Comments: resp.data } })
        setRefetchComments({ ...refetchComments, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to refetch comments!\n${err.response.data.message}`)
      })
  }

  // * Handle Like or Unlike
  async function handleLikeOrUnlike() {
    if (!likeUnlike.loading) {
      setLikeUnlike({ ...likeUnlike, loading: true, success: false, error: false })
      await MyAxios.put(`/user/content/${contentId}/like`)
        .then(resp => {
          if (resp.data.method === 'CREATE_NEW' || resp.data.method === 'RESTORE') {
            toast.success('Success like content!')
          } else if (resp.data.method === 'DESTROY') {
            toast.success('Success unlike content!')
          } else throw new Error({ response: { data: { message: 'Error enum tipe!' } } })

          setContent({ ...content, data: { ...content.data, likeCounter: resp.data.newCount } })
          setLikeUnlike({ ...likeUnlike, loading: false, success: true })
        })
        .catch(err => {
          console.error(err)
          toast.error(`Failed to like or unlike content!\n${err.response.data.message}`)
          setLikeUnlike({ ...likeUnlike, loading: false, error: true })
        })
    }
  }

  // * On Load
  useEffect(() => {
    if (!!contentId) fetchData()
  }, [contentId])

  return (
    <UserPageLayout appbarTitle='Panthreon'>
      {content.loading ? (
        <LoadingSpinner />
      ) : content.success && !!content.data ? (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Card elevation={3}>
              {!!content.data.Gallery && content.data.Gallery.length > 0 ? (
                <CardMedia
                  component={content.data.Gallery[activeGalleryIndex].type === 'video' ? 'video' : 'img'}
                  loading='lazy'
                  title={content.data.Gallery[activeGalleryIndex].name}
                  src={content.data.Gallery[activeGalleryIndex].url}
                  controls
                  controlsList='nodownload'
                  onContextMenu={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                  sx={{ aspectRatio: '9:16', userSelect: false }}
                />
              ) : null}
              {!!content.data.Gallery && content.data.Gallery.length > 1 ? (
                <CardActions sx={{ pb: 0, px: 2, justifyContent: 'space-between' }}>
                  <Typography variant='body2' color='GrayText'>
                    {content.data.Gallery[activeGalleryIndex].name}
                  </Typography>
                  <Pagination
                    count={content.data.Gallery.length}
                    page={activeGalleryIndex + 1}
                    onChange={(e, newPage) => setActiveGalleryIndex(newPage - 1)}
                    variant='outlined'
                    shape='rounded'
                  />
                </CardActions>
              ) : null}
              <CardHeader
                title={content.data.title}
                subheader={dayjs(content.data.publishedAt).format(formatDayMonth2)}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box dangerouslySetInnerHTML={{ __html: content.data.body }} />
              </CardContent>
              {!!content.data.Categories && content.data.Categories.length > 0 ? (
                <CardContent>
                  <Stack direction='row' alignItems='center' gap={0.5} mb={1}>
                    <CategoryIcon fontSize='small' />
                    <Typography fontWeight={600}>Categories</Typography>
                  </Stack>
                  <Stack direction='row' gap={1} alignItems='center' flexWrap='wrap'>
                    {content.data.Categories.map((category, index) => (
                      <Chip key={`contents-category-${index}`} size='small' label={category.label} />
                    ))}
                  </Stack>
                </CardContent>
              ) : null}
              <CardContent>
                <Stack direction='row' alignItems='center' gap={2}>
                  <Stack direction='row' alignItems='center' gap={2} sx={{ flexGrow: 1, color: 'GrayText' }}>
                    <Stack direction='row' alignItems='center' gap={0.5}>
                      <VisibilityIcon />
                      <Typography variant='body2'>{intlNumberFormat(content.data.viewCounter, true)}</Typography>
                    </Stack>
                    <Stack
                      direction='row'
                      alignItems='center'
                      gap={0.5}
                      sx={{ ':hover': { color: 'primary.main' }, cursor: 'pointer' }}
                      onClick={() => handleLikeOrUnlike()}
                    >
                      <FavoriteIcon />
                      <Typography variant='body2'>{intlNumberFormat(content.data.likeCounter, true)}</Typography>
                    </Stack>
                    <MoreActionMenu creatorId={content.data.creatorRef} />
                  </Stack>
                  <Stack
                    direction='row'
                    alignItems='center'
                    gap={0.5}
                    sx={{ color: 'GrayText', ':hover': { color: 'primary.main' }, cursor: 'pointer' }}
                    onClick={() => setShareDialogValues({ open: true })}
                  >
                    <ShareIcon />
                    <Typography variant='body2'>{intlNumberFormat(content.data.shareCounter, true)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {refetchComments.loading ? (
                  <LoadingSpinner />
                ) : (
                  <List dense disablePadding>
                    {content.data.Comments?.map((comment, index) => (
                      <CommentListItem
                        key={`content-detail-comment-${index}`}
                        comment={comment}
                        index={index}
                        contentId={contentId}
                        fetchComments={fetchComments}
                      />
                    ))}
                  </List>
                )}
                <UserAddCommentForm contentId={contentId} onSuccess={fetchComments} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack gap={2}>
              {!!content.data.Creator ? (
                <Fragment>
                  <CreatorDisplayCard
                    creator={content.data.Creator}
                    onSuccess={method => {
                      if (method === 'CREATE_NEW' || method === 'RESTORE') {
                        setContent({
                          ...content,
                          data: { ...content.data, Creator: { ...content.data.Creator, followed: true } }
                        })
                      } else if (method === 'DESTROY') {
                        setContent({
                          ...content,
                          data: { ...content.data, Creator: { ...content.data.Creator, followed: false } }
                        })
                      }
                    }}
                  />

                  <PopularContentsCard contentId={contentId} creator={content.data.Creator} />
                </Fragment>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      ) : null}

      <ShareDialog
        contentId={contentId}
        open={shareDialogValues.open}
        onClose={() => setShareDialogValues(shareDialogDefaultValues)}
      />
    </UserPageLayout>
  )
}
