'use client'

import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { MuiFileInput } from 'mui-file-input'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

import { Avatar, Box, Button, Divider, Stack, TextField } from '@mui/material'

import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import PageHeader from '@/app/(web)/_components/PageHeader'
const TextEditor = dynamic(() => import('@/app/(web)/_components/TextEditor'), { ssr: false })

const userDefaultValues = { data: null, loading: false, success: false, error: false }
const updateProfileDefaultValues = { loading: false, success: false, error: false }

export default function UserAccountProfilePage() {
  const [user, setUser] = useState(userDefaultValues)
  const [updateProfile, setUpdateProfile] = useState(updateProfileDefaultValues)

  // ** Form Hooks
  const formHook = useForm({
    defaultValues: {
      displayName: '',
      profilePicture: null,
      bio: '',
      about: '',
      banner: null
    }
  })

  // ** Fetch Current User
  async function fetchUser({ updateSession = false }) {
    setUser({ ...user, loading: true, success: false, error: false })
    await MyAxios.get('/user/profile')
      .then(resp => {
        formHook.reset({
          displayName: resp.data.displayName,
          bio: resp.data.bio ?? '',
          about: resp.data.about ?? ''
        })
        setUser({ ...user, data: resp.data, loading: false, success: true })
        if (updateSession) {
          // session.update({
          //   image: resp.data.profilePictureUrl
          // })
        }
      })
      .catch(err => {
        console.error(err)
        setUser({ ...user, data: null, loading: false, success: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchUser({ updateSession: false })
  }, [])

  // * On Submit
  async function onSubmit(data) {
    setUpdateProfile({ ...updateProfile, loading: true, success: false, error: false })

    const formData = new FormData()
    // ** Memasukkan field user profile
    formData.append('displayName', data.displayName)
    formData.append('bio', data.bio)
    if (!!data.profilePicture) formData.append('profilePicture', data.profilePicture)
    // ** Jika user adalah creator masukkan juga yang field cretor
    if (user.data.role === 'creator') {
      if (!!data.banner) formData.append('banner', data.banner)
      formData.append('about', data.about)
    }
    await MyAxios.put('/user/profile', formData)
      .then(resp => {
        toast.success('Success update profile!\nPlease relog your account to see full update on the web.', {
          duration: 5000
        })
        setUpdateProfile({ ...updateProfile, loading: false, success: true })
        fetchUser({ updateSession: true })
      })
      .catch(err => {
        console.error(err)
        toast.error('Error update profile! ' + err)
        setUpdateProfile({ ...updateProfile, loading: false, error: true })
      })
  }

  return (
    <UserPageLayout appbarTitle='Profile'>
      <AccountLayout activeNav='profile'>
        {user.loading ? (
          <LoadingSpinner />
        ) : user.success && !!user.data ? (
          <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Stack gap={2}>
              <Stack direction='row' justifyContent='center' alignItems='center'>
                <Avatar src={user.data.profilePictureUrl} sx={{ width: 120, height: 120 }} />
              </Stack>
              <Controller
                control={formHook.control}
                name='profilePicture'
                render={({ field, fieldState }) => (
                  <MuiFileInput
                    label='Upload New Profile Picture'
                    inputProps={{
                      accept: 'image/*'
                    }}
                    {...field}
                    error={Boolean(fieldState.error)}
                    helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
                    sx={{ mt: 1 }}
                  />
                )}
              />
              <TextField fullWidth label='Email' disabled value={user.data.email} />
              <TextField fullWidth label='Display Name' {...formHook.register('displayName')} />
              <TextField fullWidth label='Bio' multiline minRows={2} {...formHook.register('bio')} />
              {user.data.role === 'creator' ? (
                <Fragment>
                  <Divider />
                  <PageHeader title='Creator Profile' subTitle='Set up your creator profile' />
                  <TextField fullWidth label='Creator Username' disabled value={user.data.cUsername} />
                  <Avatar variant='square' src={user.data.bannerUrl} sx={{ width: '100%', height: 180 }} />
                  <Controller
                    control={formHook.control}
                    name='banner'
                    render={({ field, fieldState }) => (
                      <MuiFileInput
                        label='Upload New Banner'
                        inputProps={{
                          accept: 'image/*'
                        }}
                        {...field}
                        error={Boolean(fieldState.error)}
                        helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
                        sx={{ mt: 1 }}
                      />
                    )}
                  />
                  <Controller
                    control={formHook.control}
                    name='about'
                    render={({ field, fieldState }) => (
                      <Box>
                        {Boolean(fieldState.error) ? (
                          <Alert severity='error' sx={{ mb: 1 }}>
                            {fieldState.error.message}
                          </Alert>
                        ) : null}
                        <TextEditor text={field.value} setText={newValue => field.onChange(newValue)} />
                      </Box>
                    )}
                  />
                </Fragment>
              ) : null}
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='end' gap={2} mt={2}>
              <Button type='submit' variant='contained' disabled={updateProfile.loading}>
                {updateProfile.loading ? 'Saving your data...' : 'Save'}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </AccountLayout>
    </UserPageLayout>
  )
}
