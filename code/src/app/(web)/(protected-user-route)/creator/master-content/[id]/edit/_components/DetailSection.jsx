'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Box, Button, Grid, TextField } from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import MyAxios from '@/hooks/MyAxios'
import PageHeader from '@/app/(web)/_components/PageHeader'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
const TextEditor = dynamic(() => import('@/app/(web)/_components/TextEditor'), { ssr: false })

const detailFormId = 'creator-content-edit-detail-form'
const editDefaultValues = { loading: false, success: false, error: false }

export default function DetailSection({ content, fetchContent }) {
  const [edit, setEdit] = useState(editDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      title: '',
      description: '',
      body: '',
      type: 'public'
    },
    mode: 'onChange'
  })

  // * On Load
  useEffect(() => {
    if (!content.loading && content.success && !!content.data)
      formHook.reset({
        title: content.data.title,
        description: content.data.description,
        body: content.data.body,
        type: content.data.type
      })
  }, [content.loading])

  // * On Submit
  async function onSubmit(data) {
    setEdit({ ...edit, loading: true, error: false, success: false })
    await MyAxios.put(`/creator/content/${content.data.id}`, {
      type: data.type,
      title: data.title,
      body: data.body,
      description: data.description
    })
      .then(resp => {
        toast.success('Success save content!')
        setEdit({ ...edit, loading: false, success: true })
        fetchContent()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed save content!\n${err.response.data.message}`)
        setEdit({ ...edit, loading: false, error: true })
      })
  }

  return (
    <Box>
      <PageHeader
        title='Detail'
        subTitle="Content's details"
        action={
          <Button
            type='submit'
            form={detailFormId}
            variant='contained'
            startIcon={<SaveIcon />}
            disabled={edit.loading}
          >
            {edit.loading ? 'Loading...' : 'Save'}
          </Button>
        }
        sx={{ mb: 2 }}
      />
      {content.loading ? (
        <LoadingSpinner />
      ) : content.success && !!content.data ? (
        <Box id={detailFormId} component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                    <TextEditor
                      labelId='body-content'
                      text={field.value}
                      setText={newValue => field.onChange(newValue)}
                    />
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  )
}
