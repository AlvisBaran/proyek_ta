'use client'

import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { MuiFileInput } from 'mui-file-input'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import PageHeader from '@/app/(web)/_components/PageHeader'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'

const galleryDefaultValues = { data: [], loading: false, error: false, success: false }
const deleteGalleryDefaultValues = { loading: false, error: false, success: false }

export default function GallerySection({ content, fetchContent }) {
  const { pushConfirm } = useDialog()
  const [gallery, setGallery] = useState(galleryDefaultValues)
  const [deleteGallery, setDeleteGallery] = useState(deleteGalleryDefaultValues)
  const [openAddDialog, setOpenAddDialog] = useState(false)

  // * Fetch Data
  async function fetchGallery() {
    setGallery({ ...gallery, loading: true, success: false, error: false })
    await MyAxios.get(`/creator/content/${content.data.id}/gallery`)
      .then(resp => {
        setGallery({ ...gallery, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error('Failed to fetch gallery')
        setGallery({ ...gallery, data: [], loading: false, error: true })
      })
  }

  // * Delete Data
  async function handleDeleteGallery(galleryId) {
    setDeleteGallery({ ...deleteGallery, loading: true, success: false, error: false })
    await MyAxios.delete(`/creator/content/${content.data.id}/gallery/${galleryId}`)
      .then(resp => {
        toast.success('Success delete gallery!')
        setDeleteGallery({ ...deleteGallery, loading: false, success: true })
        fetchGallery()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to delete gallery!\n${err.response.data.message}`)
        setDeleteGallery({ ...deleteGallery, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!content.loading && content.success && !!content.data) fetchGallery()
  }, [content.loading])

  return (
    <Box>
      <PageHeader
        title='Gallery'
        subTitle="Set content's images. Max: 4"
        action={
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            disabled={content.loading || gallery.loading || gallery.data?.length >= 4}
            onClick={() => setOpenAddDialog(true)}
          >
            Add
          </Button>
        }
        sx={{ mb: 2 }}
      />
      {content.loading || gallery.loading || deleteGallery.loading ? (
        <LoadingSpinner />
      ) : content.success && !!content.data && gallery.success ? (
        <Grid container spacing={2}>
          {gallery.data.map((item, index) => (
            <Grid key={`creator-content-edit-${content.data.id}-gallery-item-${index}`} item xs={12} md={6}>
              <Card elevation={3}>
                <CardHeader
                  title={item.title}
                  titleTypographyProps={{ variant: 'body1', fontWeight: 600 }}
                  subheader={dayjs(item.createdAt).format(formatDateTime)}
                  subheaderTypographyProps={{ variant: 'body2' }}
                  action={
                    <IconButton
                      color='error'
                      onClick={() =>
                        pushConfirm({
                          title: 'Delete gallery?',
                          content: 'Are you sure to delete this one?',
                          onAgreeBtnClick: () => handleDeleteGallery(item.id)
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
                <CardActionArea>
                  <CardMedia
                    component='img'
                    sx={{ aspectRatio: '9:16', height: 260 }}
                    src={item.url}
                    title={item.title}
                    alt={item.alt}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {content.success && !!content.data ? (
        <AddGalleryDialog
          contentId={content.data.id}
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onSuccess={fetchGallery}
        />
      ) : null}
    </Box>
  )
}

const addGalleryFormId = 'creator-content-gallery-add-form'
const addGalleryDefaultValues = { loading: false, error: false, success: false }

function AddGalleryDialog({ contentId, open, onClose, onSuccess }) {
  const [addGallery, setAddGallery] = useState(addGalleryDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      title: '',
      alt: '',
      image: null
    },
    mode: 'onChange'
  })

  // * On Close
  function handleClose() {
    formHook.reset()
    if (!!onClose) onClose()
  }

  // * On Submit
  async function onSubmit(data) {
    setAddGallery({ ...addGallery, loading: true, error: false, success: false })
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('alt', data.alt)
    if (!!data.image) formData.append('image', data.image)
    await MyAxios.post(`/creator/content/${contentId}/gallery`, formData)
      .then(resp => {
        toast.success('Success add gallery!')
        setAddGallery({ ...addGallery, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error add gallery!\n${err.response.data.message}`)
        setAddGallery({ ...addGallery, loading: false, error: true })
      })
  }

  return (
    <Dialog fullWidth maxWidth='xs' open={open}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Add New Gallery</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box component='form' id={addGalleryFormId} onSubmit={formHook.handleSubmit(onSubmit)}>
          <Controller
            control={formHook.control}
            name='image'
            rules={{ required: 'Image is required!' }}
            render={({ field, fieldState }) => (
              <MuiFileInput
                fullWidth
                margin='normal'
                label='Image'
                inputProps={{
                  accept: 'image/*, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx'
                }}
                {...field}
                error={Boolean(fieldState.error)}
                helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
              />
            )}
          />
          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin='normal'
            label='Title'
            placeholder='Type your image title here!'
            {...formHook.register('title', {
              required: 'Title field is required!',
              minLength: { value: 2, message: 'Min lenght of 2!' }
            })}
            error={Boolean(formHook.formState.errors.title)}
            helperText={Boolean(formHook.formState.errors.title) ? formHook.formState.errors.title.message : undefined}
          />
          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin='normal'
            label='Alternative Text'
            placeholder='Type your image alterative text here!'
            {...formHook.register('alt', {
              required: 'Alternative Text field is required!',
              minLength: { value: 2, message: 'Min lenght of 2!' }
            })}
            error={Boolean(formHook.formState.errors.alt)}
            helperText={Boolean(formHook.formState.errors.alt) ? formHook.formState.errors.alt.message : undefined}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type='submit' form={addGalleryFormId} variant='contained' disabled={addGallery.loading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
