'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MuiFileInput } from 'mui-file-input'

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField
} from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const formId = 'creator-membership-edit-form'
const membershipDefaultValues = { data: null, loading: false, error: false, success: false }
const editDefaultValues = { loading: false, error: false, success: false }

export default function MembershipEditDialog({ id, open, onClose, onSuccess }) {
  const [membership, setMembership] = useState(membershipDefaultValues)
  const [edit, setEdit] = useState(editDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      name: '',
      slug: '',
      banner: null,
      description: '',
      interval: 30,
      price: 1000
    },
    mode: 'onChange'
  })

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
    formHook.reset()
  }

  // * Fetch Membership
  async function fetchData() {
    setMembership({ ...membership, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/membership/${id}`)
      .then(resp => {
        formHook.reset({
          name: resp.data.name,
          slug: resp.data.slug,
          description: resp.data.description,
          interval: resp.data.interval,
          price: resp.data.price
        })
        setMembership({ ...membership, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMembership({ ...membership, data: null, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!id && open) fetchData()
  }, [id, open])

  // * On Submit
  async function onSubmit(data) {
    setEdit({ ...edit, loading: true, error: false, success: false })
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('slug', String(data.slug).replaceAll(' ', '-').replaceAll('.', '-').toLowerCase().trim())
    if (!!data.banner) formData.append('banner', data.banner)
    formData.append('description', data.description)
    formData.append('interval', data.interval)
    formData.append('price', data.price)
    await MyAxios.put(`/creator/membership/${id}`, formData)
      .then(resp => {
        toast.success('Success edit membership!')
        setEdit({ ...edit, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error edit membership!\n${err.response.data.message}`)
        setEdit({ ...edit, loading: false, error: true })
      })
  }

  return (
    <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit Membership</DialogTitle>
      <DialogContent>
        <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off'>
          {membership.loading ? (
            <LoadingSpinner />
          ) : membership.success && !!membership.data ? (
            <Stack gap={0}>
              {!!membership.data.bannerUrl ? (
                <Avatar src={membership.data.bannerUrl} variant='square' sx={{ width: '100%', height: 'auto' }} />
              ) : null}
              <Controller
                control={formHook.control}
                name='banner'
                render={({ field, fieldState }) => (
                  <MuiFileInput
                    fullWidth
                    margin='normal'
                    label={!!membership.data.bannerUrl ? 'Upload New Banner' : 'Upload Banner'}
                    inputProps={{
                      accept: 'image/*'
                    }}
                    {...field}
                    error={Boolean(fieldState.error)}
                    helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
                  />
                )}
              />
              <TextField
                fullWidth
                margin='normal'
                label='Name'
                {...formHook.register('name', {
                  required: 'Name is required!',
                  minLength: { value: 3, message: 'Minimal lenght of 3' }
                })}
                error={Boolean(formHook.formState.errors.name)}
                helperText={
                  Boolean(formHook.formState.errors.name) ? formHook.formState.errors.name.message : undefined
                }
              />
              <TextField
                fullWidth
                margin='normal'
                label='Slug'
                {...formHook.register('slug', {
                  required: 'Slug is required!',
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: 'Only use letters, numbers, and dash (dash allowed only at between words).'
                  }
                })}
                error={Boolean(formHook.formState.errors.slug)}
                helperText={
                  Boolean(formHook.formState.errors.slug) ? formHook.formState.errors.slug.message : undefined
                }
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                margin='normal'
                label='Description'
                {...formHook.register('description')}
                error={Boolean(formHook.formState.errors.description)}
                helperText={
                  Boolean(formHook.formState.errors.description)
                    ? formHook.formState.errors.description.message
                    : undefined
                }
              />
              <TextField
                fullWidth
                margin='normal'
                label='Interval'
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='end'>day(s)</InputAdornment>
                }}
                {...formHook.register('interval', {
                  required: 'Interval is required!'
                })}
                error={Boolean(formHook.formState.errors.interval)}
                helperText={
                  Boolean(formHook.formState.errors.interval) ? formHook.formState.errors.interval.message : undefined
                }
              />
              <TextField
                fullWidth
                margin='normal'
                label='Price'
                type='number'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                }}
                {...formHook.register('price', {
                  required: 'Price is required!'
                })}
                error={Boolean(formHook.formState.errors.price)}
                helperText={
                  Boolean(formHook.formState.errors.price) ? formHook.formState.errors.price.message : undefined
                }
              />
            </Stack>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' type='reset' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='submit' form={formId} variant='contained' disabled={edit.loading}>
          {edit.loading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
