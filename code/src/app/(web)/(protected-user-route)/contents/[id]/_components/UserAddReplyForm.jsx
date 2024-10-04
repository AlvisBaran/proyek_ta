'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Avatar, Box, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

const addReplyDefaultValues = { loading: false, error: false, success: false }

export default function UserAddReplyForm({ contentId, commentId, onSuccess }) {
  const session = useSession()
  const user = getUserFromComposedSession(session.data)
  const [addReply, setAddReply] = useState(addReplyDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      content: ''
    },
    mode: 'onChange'
  })

  // * On Submit
  async function onSubmit(data) {
    setAddReply({ ...addReply, loading: true, error: false, success: false })
    await MyAxios.post(`/user/content/${contentId}/comment/${commentId}/reply`, {
      content: data.content
    })
      .then(resp => {
        setAddReply({ ...addReply, loading: false, success: true })
        formHook.reset()
        if (!!onSuccess) onSuccess()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to add comment!\n${err.response.data.message}`)
        setAddReply({ ...addReply, loading: false, error: true })
      })
  }

  if (!!user)
    return (
      <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off' sx={{ pl: 5 }}>
        <Stack direction='row' alignItems='center' gap={2} sx={{ px: 2, pt: 2 }}>
          <Avatar src={user.profilePicture} />
          <TextField
            fullWidth
            size='small'
            placeholder='Add a reply...'
            disabled={addReply.loading}
            InputProps={{
              endAdornment: addReply.loading ? (
                <InputAdornment position='end'>
                  <CircularProgress size={24} />
                </InputAdornment>
              ) : undefined
            }}
            {...formHook.register('content', {
              required: 'Please enter a valid comment!'
            })}
            error={Boolean(formHook.formState.errors.content)}
            // helperText={
            //   Boolean(formHook.formState.errors.content) ? formHook.formState.errors.content.message : undefined
            // }
          />
        </Stack>
      </Box>
    )

  return null
}
