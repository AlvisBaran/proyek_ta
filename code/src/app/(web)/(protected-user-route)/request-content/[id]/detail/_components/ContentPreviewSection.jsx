'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Divider,
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
import CommentListItem from '@/app/(web)/(protected-user-route)/contents/[id]/_components/CommentListItem'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import UserAddCommentForm from '@/app/(web)/(protected-user-route)/contents/[id]/_components/UserAddCommentForm'
import ShareDialog from '@/app/(web)/(protected-user-route)/contents/[id]/_components/ShareDialog'
import MoreActionMenu from '@/app/(web)/(protected-user-route)/contents/[id]/_components/MoreActionMenu'

import dayjs from 'dayjs'
import { formatDayMonth2 } from '@/utils/dayjsConst'
import { Watermark } from '@hirohe/react-watermark'

const contentDefaultValues = { data: null, loading: false, success: false, error: false }
const likeUnlikeDefaultValues = { loading: false, error: false, success: false }
const refetchCommentsDefaultValues = { loading: false, error: false, success: false }
const shareDialogDefaultValues = { open: false }

export default function ContentPreviewSection({ contentId, status }) {
  const showWatermark = status !== 'done'
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [content, setContent] = useState(contentDefaultValues)
  const [likeUnlike, setLikeUnlike] = useState(likeUnlikeDefaultValues)
  const [shareDialogValues, setShareDialogValues] = useState(shareDialogDefaultValues)
  const [refetchComments, setRefetchComments] = useState(refetchCommentsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setContent({ ...content, loading: true, error: false, success: false })
    if (!content.loading)
      await MyAxios.get(`/user/content/${contentId}`)
        .then(resp => {
          setContent({ ...content, data: resp.data, loading: false, success: true })
        })
        .catch(err => {
          console.error(err)
          toast.error(`Failed to load content!\n${err.response.data.message}`)
          setContent({ ...content, data: null, loading: false, error: true })
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

  if (content.loading) return <LoadingSpinner />
  else if (content.success && !!content.data)
    return (
      <Fragment>
        <Card elevation={3}>
          {!!content.data.Gallery && content.data.Gallery.length > 0 ? (
            <Watermark
              show={showWatermark}
              text={`Property of ${content.data.Creator.displayName}`}
              opacity={1}
              rotate={-15}
            >
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
            </Watermark>
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
            subheader={dayjs(content.data.publishedAt ?? content.data.createdAt).format(formatDayMonth2)}
            sx={{ pb: 1 }}
          />
          {showWatermark ? (
            <Alert severity='info' sx={{ borderRadius: 0 }}>
              Watermark will be removed when payment is complete and creator confirmed done!
            </Alert>
          ) : null}
          <CardContent sx={{ pt: 1 }}>
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
                    key={`request-content-preview-content-comment-${index}`}
                    comment={comment}
                    index={index}
                    contentId={content.data.id}
                    fetchComments={fetchComments}
                  />
                ))}
              </List>
            )}
            <UserAddCommentForm contentId={content.data.id} onSuccess={fetchComments} />
          </CardContent>
        </Card>

        <ShareDialog
          contentId={contentId}
          open={shareDialogValues.open}
          onClose={() => setShareDialogValues(shareDialogDefaultValues)}
        />
      </Fragment>
    )
  return null
}
