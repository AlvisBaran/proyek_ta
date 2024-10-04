'use client'

import { Fragment, useState } from 'react'

import { Avatar, Collapse, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UserAddReplyForm from './UserAddReplyForm'

dayjs.extend(relativeTime)

export default function CommentListItem({ index, contentId, comment, fetchComments }) {
  const [openReplies, setOpenReplies] = useState(false)
  const [openAddReply, setOpenAddReply] = useState(false)

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
                    onClick={() => {
                      setOpenReplies(!openReplies)
                      setOpenAddReply(false)
                    }}
                  >
                    {openReplies ? 'Hide replies' : `View replies (${comment.Replies.length})`}
                  </Typography>
                </Fragment>
              ) : null}
              <Typography variant='body2'>{'—'}</Typography>
              <Typography
                variant='body2'
                fontWeight={600}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setOpenReplies(true)
                  setOpenAddReply(!openAddReply)
                }}
              >
                {openAddReply ? 'Cancel' : 'Reply'}
              </Typography>
            </Stack>
          }
          secondaryTypographyProps={{ component: 'span' }}
        />
      </ListItem>
      {!!comment.Replies && comment.Replies.length > 0 ? (
        <Collapse in={openReplies} timeout='auto' unmountOnExit>
          <List dense disablePadding sx={{ pl: 5 }}>
            {comment.Replies.map((reply, index2) => (
              <ListItem key={`content-detail-comment-${index}-reply-${index2}`}>
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
      <Collapse in={openAddReply} timeout='auto' unmountOnExit>
        <UserAddReplyForm contentId={contentId} commentId={comment.id} onSuccess={fetchComments} />
      </Collapse>
    </Fragment>
  )
}
