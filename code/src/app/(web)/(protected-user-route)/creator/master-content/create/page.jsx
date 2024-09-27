'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Alert, Box, Button, Grid, TextField } from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import MyAxios from '@/hooks/MyAxios'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import CreatorPageLayout from '../../_components/layout'
import toast from 'react-hot-toast'
const TextEditor = dynamic(() => import('@/app/(web)/_components/TextEditor'), { ssr: false })

const createDefaultValues = { loading: false, error: false, success: false }

export default function CreatorMasterContentCreatePage() {
  const router = useRouter()
  const [create, setCreate] = useState(createDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      title: `draft-content-${new Date().getTime()}`,
      description: '',
      body: ''
    },
    mode: 'onChange'
  })

  async function onSubmit(data) {
    setCreate({ ...create, loading: true, error: false, success: false })
    await MyAxios.post('/creator/content', {
      type: 'public',
      title: data.title,
      description: data.description,
      body: data.body
    })
      .then(resp => {
        toast.success('Success save content!')
        router.replace(`/creator/master-content/${resp.data.created.id}/edit`)
        setCreate({ ...create, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to save content!\n${err.response.data.message}`)
        setCreate({ ...create, loading: false, error: true })
      })
  }

  return (
    <CreatorPageLayout appbarTitle='Create New Content'>
      <Breadcrumb
        data={[
          {
            title: 'Master Content',
            url: '/creator/master-content'
          },
          {
            title: 'Create Content',
            url: '/creator/master-content/create'
          }
        ]}
      />
      <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={8} md={9}>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              InputLabelProps={{ shrink: true }}
              label='Title'
              placeholder='Set your content title!'
              {...formHook.register('title', {
                required: 'Title is required!',
                minLength: { value: 3, message: 'Minimum length of 3!' }
              })}
              error={Boolean(formHook.formState.errors.title)}
              helperText={
                Boolean(formHook.formState.errors.title) ? formHook.formState.errors.title.message : undefined
              }
            />
          </Grid>
          <Grid item xs={4} md={3}>
            <Button type='submit' fullWidth variant='contained' startIcon={<SaveIcon />} disabled={create.loading}>
              {create.loading ? 'Loading...' : 'Next'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              variant='outlined'
              size='small'
              InputLabelProps={{ shrink: true }}
              label='Description'
              placeholder='Set your content short description!'
              {...formHook.register('description', {
                required: 'Description is required!',
                minLength: { value: 3, message: 'Minimum length of 3!' }
              })}
              error={Boolean(formHook.formState.errors.description)}
              helperText={
                Boolean(formHook.formState.errors.description)
                  ? formHook.formState.errors.description.message
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={formHook.control}
              name='body'
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
          </Grid>
        </Grid>
      </Box>
    </CreatorPageLayout>
  )
}
