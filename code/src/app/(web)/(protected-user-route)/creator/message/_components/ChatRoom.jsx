'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

const roomDefaultValues = { data: null, loading: false, success: false, error: false }
const submitChatDefaultValues = { loading: false, success: false, error: false }

export default function ChatRoom({ selectedRoom, onClose, mode, fetchRooms }) {
  const session = useSession()
  const user = getUserFromComposedSession(session.data)
  const [timeTrigger, setTimeTrigger] = useState(false)
  const [room, setRoom] = useState(roomDefaultValues)
  const [submitChat, setSubmitChat] = useState(submitChatDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: { content: '' },
    mode: 'onChange'
  })

  // * Fetch Room
  async function fetchRoom(firstTime) {
    setRoom({ ...room, loading: firstTime ? true : undefined, success: false, error: false })
    await MyAxios.get(`/user/messaging/${selectedRoom.id}`, {
      params: { withChats: true }
    })
      .then(resp => {
        setRoom({ ...room, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setRoom({ ...room, data: null, loading: false, error: true })
      })
  }

  // * Fetch On Interval
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!!selectedRoom) fetchRoom(false)
  //     setTimeTrigger(!timeTrigger)
  //   }, 5000)
  // }, [timeTrigger])

  // * On Load
  useEffect(() => {
    if (!!selectedRoom) fetchRoom(true)
  }, [selectedRoom])

  // * On Submit
  async function onSubmit(data) {
    setSubmitChat({ ...submitChat, loading: true, success: false, error: false })
    await MyAxios.put(`/user/messaging/${selectedRoom.id}`, { content: data.content })
      .then(resp => {
        toast.success('Success to send chat!')
        formHook.reset()
        setSubmitChat({ ...submitChat, loading: false, success: true })
        fetchRoom(false)
        fetchRooms()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to send chat!\n${err.response.data.message}`)
        setSubmitChat({ ...submitChat, loading: false, error: true })
      })
  }

  return (
    <ChatRoomWrapper
      mode={mode}
      onClose={onClose}
      room={room}
      openChatRoom={!!selectedRoom}
      bodyContent={
        !!user ? (
          <Stack gap={2}>
            {room.data?.Chats?.map((chat, index) => (
              <Stack
                key={`creator-message-room-chat-${index}`}
                direction={chat.authorRef === user.id ? 'row-reverse' : 'row'}
                gap={1}
              >
                <Avatar src={chat.Author?.profilePictureUrl} />
                <Paper elevation={3} sx={{ p: 1 }}>
                  {chat.content}
                </Paper>
              </Stack>
            ))}
          </Stack>
        ) : (
          <CircularProgress />
        )
      }
      inputUI={
        <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
          <Stack direction='row' gap={1} sx={{ p: 1 }}>
            <TextField
              fullWidth
              autoComplete='off'
              disabled={submitChat.loading}
              placeholder='Type any chats!'
              {...formHook.register('content', {
                required: 'Chat required!',
                minLength: { value: 1, message: 'Minimum length of 1!' }
              })}
            />
            <Button type='submit' variant='contained' disabled={room.loading || submitChat.loading}>
              <SendIcon />
            </Button>
          </Stack>
        </Box>
      }
    />
  )
}

function ChatRoomWrapper({ mode, onClose, openChatRoom, room, bodyContent, inputUI }) {
  if (mode === 'grid')
    return (
      <Grid item xs={8}>
        <Card elevation={3}>
          {!openChatRoom || room.loading ? (
            <CardContent sx={{ height: 500 }}>
              <Stack
                alignItems='center'
                justifyContent='center'
                sx={{
                  width: '100%',
                  height: '100%',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  borderRadius: 1
                }}
              >
                {room.loading ? (
                  <CircularProgress />
                ) : (
                  <Typography variant='body2' color='GrayText'>
                    Select message room to start chatting :)
                  </Typography>
                )}
              </Stack>
            </CardContent>
          ) : openChatRoom && room.success ? (
            <Stack sx={{ height: 500 }}>
              <CardHeader
                avatar={<Avatar src={room.data?.Partner?.profilePictureUrl} />}
                title={room.data?.Partner?.displayName}
                subheader={room.data?.Partner?.cUsername}
                action={
                  <IconButton onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <Divider />
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>{bodyContent}</Box>
              <Divider />
              {inputUI}
            </Stack>
          ) : null}
        </Card>
      </Grid>
    )
  else if (mode === 'dialog')
    return (
      <Dialog open={openChatRoom} fullScreen onClose={onClose}>
        <DialogTitle>
          <Stack direction='row' gap={1} alignItems='center'>
            <Stack direction='row' gap={2} alignItems='center' sx={{ flexGrow: 1 }}>
              <Avatar src={room.data?.Partner?.profilePictureUrl} />
              <Box>
                <Typography variant='h6'>{room.data?.Partner?.displayName}</Typography>
                <Typography variant='body2'>{room.data?.Partner?.cUsername}</Typography>
              </Box>
            </Stack>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>{bodyContent}</DialogContent>
        <Divider />
        {inputUI}
      </Dialog>
    )

  return null
}
