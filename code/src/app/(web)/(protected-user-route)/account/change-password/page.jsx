'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

import { Box, Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'

import MyAxios from '@/hooks/MyAxios'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const changePasswordDefaultValues = { loading: false, success: false, error: false }

export default function UserAccountChangePasswordPage() {
  const session = useSession()
  const user = getUserFromComposedSession(session.data)
  const [changePassword, setChangePassword] = useState(changePasswordDefaultValues)
  const [oldViewMode, setOldViewMode] = useState(false)
  const [newViewMode, setNewViewMode] = useState(false)

  // ** Form Hooks
  const formHook = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    },
    mode: 'onChange'
  })

  // * On Submit
  async function onSubmit(data) {
    setChangePassword({ ...changePassword, loading: true, success: false, error: false })
    await MyAxios.put('/auth/change-password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    })
      .then(resp => {
        toast.success(resp.data.message, {
          duration: 5000
        })
        setChangePassword({ ...changePassword, loading: false, success: true })
        formHook.reset()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error change password!\n${err.response.data.message}`)
        setChangePassword({ ...changePassword, loading: false, error: true })
      })
  }

  return (
    <UserPageLayout appbarTitle='Change Password'>
      <AccountLayout activeNav='change-password'>
        {!user ? (
          <LoadingSpinner />
        ) : (
          <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Stack gap={2}>
              <TextField
                fullWidth
                label='Old Password'
                placeholder='Type your old password'
                type={oldViewMode ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setOldViewMode(!oldViewMode)}>
                        {oldViewMode ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...formHook.register('oldPassword', {
                  required: 'Old Password harus di-isi!',
                  minLength: { value: 6, message: 'Min length of 6!' }
                })}
                error={Boolean(formHook.formState.errors.oldPassword)}
                helperText={
                  Boolean(formHook.formState.errors.oldPassword)
                    ? formHook.formState.errors.oldPassword.message
                    : undefined
                }
              />
              <TextField
                fullWidth
                label='New Password'
                placeholder='Type your new password'
                type={newViewMode ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setNewViewMode(!newViewMode)}>
                        {newViewMode ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...formHook.register('newPassword', {
                  required: 'New Password harus di-isi!',
                  minLength: { value: 6, message: 'Min length of 6!' }
                })}
                error={Boolean(formHook.formState.errors.newPassword)}
                helperText={
                  Boolean(formHook.formState.errors.newPassword)
                    ? formHook.formState.errors.newPassword.message
                    : undefined
                }
              />
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='end' gap={2} mt={2}>
              <Button type='submit' variant='contained' disabled={changePassword.loading}>
                {changePassword.loading ? 'Loading...' : 'Submit'}
              </Button>
            </Stack>
          </Box>
        )}
      </AccountLayout>
    </UserPageLayout>
  )
}
