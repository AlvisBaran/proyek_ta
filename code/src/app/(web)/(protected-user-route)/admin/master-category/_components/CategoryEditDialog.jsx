'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const formId = 'admin-category-edit-form'
const categoryDefaultValues = { data: null, loading: false, error: false, success: false }
const editDefaultValues = { loading: false, error: false, success: false }

export default function CategoryEditDialog({ id, open, onClose, onSuccess }) {
  const [category, setCategory] = useState(categoryDefaultValues)
  const [edit, setEdit] = useState(editDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      label: ''
    },
    mode: 'onChange'
  })

  // * Fetch Category
  async function fetchData() {
    setCategory({ ...category, loading: true, error: false, success: false })
    await MyAxios.get(`/admin/category/${id}`)
      .then(resp => {
        formHook.reset({
          label: resp.data.label
        })
        setCategory({ ...category, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error('Error loading data!')
        setCategory({ ...category, data: null, loading: false, error: true })
        handleClose()
      })
  }

  // * On Load
  useEffect(() => {
    if (!!id) fetchData()
  }, [id])

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
    formHook.reset()
  }

  // * On Submit
  async function onSubmit(data) {
    setEdit({ ...edit, loading: true, error: false, success: false })
    await MyAxios.put(`/admin/category/${id}`, {
      label: data.label
    })
      .then(resp => {
        toast.success('Success edit category!')
        setEdit({ ...edit, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error edit category!`)
        setEdit({ ...edit, loading: false, error: true })
        formHook.setError('label', { type: 'validate', message: err.response.data.error.label })
      })
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit Category</DialogTitle>
      {category.loading ? (
        <LoadingSpinner />
      ) : category.success ? (
        <DialogContent>
          <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off'>
            <TextField
              fullWidth
              margin='normal'
              label='Label'
              {...formHook.register('label', {
                required: 'Label is required!',
                minLength: { value: 3, message: 'Minimal lenght of 3' }
              })}
              error={Boolean(formHook.formState.errors.label)}
              helperText={
                Boolean(formHook.formState.errors.label) ? formHook.formState.errors.label.message : undefined
              }
            />
          </Box>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button variant='outlined' type='reset' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='submit' form={formId} variant='contained' disabled={category.loading || edit.loading}>
          {edit.loading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
