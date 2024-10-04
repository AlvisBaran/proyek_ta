'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MuiFileInput } from 'mui-file-input'

import {
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

const formId = 'creator-membership-add-form'
const createDefaultValues = { loading: false, error: false, success: false }

export default function MembershipAddDialog({ open, onClose, onSuccess }) {
  const [create, setCreate] = useState(createDefaultValues)

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

  // * On Submit
  async function onSubmit(data) {
    setCreate({ ...create, loading: true, error: false, success: false })
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('slug', String(data.slug).replaceAll(' ', '-').replaceAll('.', '-').toLowerCase().trim())
    if (!!data.banner) formData.append('banner', data.banner)
    formData.append('description', data.description)
    formData.append('interval', data.interval)
    formData.append('price', data.price)
    await MyAxios.post('/creator/membership', formData)
      .then(resp => {
        toast.success('Success add membership!')
        setCreate({ ...create, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error add membership!\n${err.response.data.message}`)
        setCreate({ ...create, loading: false, error: true })
      })
  }

  return (
    <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Add Membership</DialogTitle>
      <DialogContent>
        <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off'>
          <Stack gap={0}>
            <Controller
              control={formHook.control}
              name='banner'
              render={({ field, fieldState }) => (
                <MuiFileInput
                  fullWidth
                  margin='normal'
                  label='Banner'
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
              helperText={Boolean(formHook.formState.errors.name) ? formHook.formState.errors.name.message : undefined}
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
              helperText={Boolean(formHook.formState.errors.slug) ? formHook.formState.errors.slug.message : undefined}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' type='reset' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='submit' form={formId} variant='contained' disabled={create.loading}>
          {create.loading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
