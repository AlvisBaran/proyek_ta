'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'

const formId = 'admin-category-add-form'
const createDefaultValues = { loading: false, error: false, success: false }

export default function CategoryAddDialog({ open, onClose, onSuccess }) {
  const [create, setCreate] = useState(createDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      label: ''
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
    await MyAxios.post('/admin/category', {
      label: data.label
    })
      .then(resp => {
        toast.success('Success add category!')
        setCreate({ ...create, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error add category!`)
        setCreate({ ...create, loading: false, error: true })
        formHook.setError('label', { type: 'validate', message: err.response.data.error.label })
      })
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Add Category</DialogTitle>
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
            helperText={Boolean(formHook.formState.errors.label) ? formHook.formState.errors.label.message : undefined}
          />
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
