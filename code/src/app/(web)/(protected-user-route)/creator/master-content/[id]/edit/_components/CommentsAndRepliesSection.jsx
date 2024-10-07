'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const commentsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CommentsAndRepliesSection({ content }) {
  const [comments, setComments] = useState(commentsDefaultValues)

  // * Fetch Data
  async function fetchComments() {
    setComments({ ...comments, loading: true, success: false, error: false })
    await MyAxios.get(`/creator/content/${content.data.id}/comment`)
      .then(resp => {
        setComments({ ...comments, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error('Failed to fetch comments and replies')
        setComments({ ...comments, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!content.loading && content.success && !!content.data) fetchComments()
  }, [content.loading])

  return (
    <Box>
      {/* <PageHeader title='Comments & Replies' subTitle="Content's comments and replies" sx={{ mb: 2 }} /> */}
      <Card elevation={3}>
        <CardHeader
          title='Comments & Replies'
          titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
          subheader="Content's comments and replies"
          subheaderTypographyProps={{ variant: 'body2' }}
        />
        <Divider />
        {content.loading || comments.loading ? (
          <LoadingSpinner />
        ) : content.success && !!content.data && comments.success ? (
          <CardContent sx={{ p: 0 }}>
            <List dense disablePadding>
              {comments.data?.map((comment, index) => (
                <CommentListItem key={`creator-content-edit-comment-${index}`} index={index} comment={comment} />
              ))}
              {comments.data.length <= 0 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <QuestionMarkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Opps!' secondary='There are no comments and replies yet!' />
                </ListItem>
              ) : null}
            </List>
          </CardContent>
        ) : null}
      </Card>
    </Box>
  )
}

function CommentListItem({ index, comment }) {
  const [openReplies, setOpenReplies] = useState(false)

  return (
    <Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={comment.User.profilePictureUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component='span' variant='body2' fontWeight={600}>
              {comment.User.cUsername ?? comment.User.displayName}
              <Typography variant='body2'>{comment.content}</Typography>
            </Typography>
          }
          primaryTypographyProps={{ component: 'span' }}
          secondary={
            <Stack direction='row' gap={1} alignItems='center'>
              <Typography variant='body2'>{dayjs(comment.createdAt).fromNow()}</Typography>
              {!!comment.Replies && comment.Replies.length > 0 ? (
                <Fragment>
                  <Typography variant='body2'>{'—'}</Typography>
                  <Typography
                    variant='body2'
                    fontWeight={600}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setOpenReplies(!openReplies)}
                  >
                    {openReplies ? 'Hide replies' : `View replies (${comment.Replies.length})`}
                  </Typography>
                </Fragment>
              ) : null}
            </Stack>
          }
          secondaryTypographyProps={{ component: 'span' }}
        />
      </ListItem>
      {!!comment.Replies && comment.Replies.length > 0 ? (
        <Collapse in={openReplies} timeout='auto' unmountOnExit>
          <List dense disablePadding sx={{ pl: 5 }}>
            {comment.Replies.map((reply, index2) => (
              <ListItem key={`creator-content-edit-comment-${index}-reply-${index2}`}>
                <ListItemAvatar>
                  <Avatar src={reply.User.profilePictureUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component='span' variant='body2' fontWeight={600}>
                      {reply.User.cUsername ?? reply.User.displayName}
                      <Typography variant='body2'>{reply.content}</Typography>
                    </Typography>
                  }
                  primaryTypographyProps={{ component: 'span' }}
                  secondary={dayjs(reply.createdAt).fromNow()}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      ) : null}
    </Fragment>
  )
}
