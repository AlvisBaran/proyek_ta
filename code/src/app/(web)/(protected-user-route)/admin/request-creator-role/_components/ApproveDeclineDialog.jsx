'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import toast from 'react-hot-toast'

const formId = 'admin-request-creator-role-approve-decine-form'
const approveOrDeclineDefaultValues = { loading: false, error: false, success: false }

export default function ApproveDeclineDialog({ id, newUsername, type, open, onClose, onSuccess }) {
  const [approveOrDecline, setApproveOrDecline] = useState(approveOrDeclineDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      specifiedUsername: newUsername,
      adminNote: ''
    }
  })

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
    formHook.reset()
  }

  // * Submit or Decline
  async function onSubmit(data) {
    setApproveOrDecline({ ...approveOrDecline, loading: true, error: false, success: false })
    await MyAxios.put(`/admin/account-upgrade/${id}`, {
      specifiedUsername:
        type === 'approve' ? (!!String(data.specifiedUsername).trim() ? data.specifiedUsername : undefined) : undefined,
      adminNote: data.adminNote,
      action: type
    })
      .then(resp => {
        toast.success(`Success ${type}!`)
        setApproveOrDecline({ ...approveOrDecline, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error ${type}!\n${err.response.data.message}`)
        setApproveOrDecline({ ...approveOrDecline, loading: false, error: true })
      })
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
      <DialogTitle>{type === 'approve' ? 'Approve Request' : 'Decline Request'}</DialogTitle>
      <DialogContent>
        <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off'>
          {type === 'approve' ? (
            <TextField
              fullWidth
              margin='normal'
              label='New Username'
              {...formHook.register('specifiedUsername')}
              helperText='Leave it empty for using username choosen by user themselves.'
            />
          ) : null}
          <TextField
            fullWidth
            multiline
            minRows={4}
            margin='normal'
            label='Note'
            {...formHook.register('adminNote', {
              required: 'Note is required!',
              minLength: { value: 3, message: 'Minimal lenght of 3' }
            })}
            error={Boolean(formHook.formState.errors.adminNote)}
            helperText={
              Boolean(formHook.formState.errors.adminNote) ? formHook.formState.errors.adminNote.message : undefined
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' type='reset' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='submit' form={formId} variant='contained' disabled={approveOrDecline.loading}>
          {approveOrDecline.loading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
