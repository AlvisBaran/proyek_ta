'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { MuiFileInput } from 'mui-file-input'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'

const formId = 'admin-withdraw-approve-form'
const approveWithdrawDefaultValues = { loading: false, error: false, success: false }

export default function ApproveDialog({ id, open, onClose, onSuccess }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [approve, setApprove] = useState(approveWithdrawDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      action: 'accept',
      proofOfTransfer: null
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
    setApprove({ ...approve, loading: true, success: false, error: false })
    const formData = new FormData()
    formData.append('action', data.action)
    formData.append('proofOfTransfer', data.proofOfTransfer)
    await MyAxios.put(`/admin/request-withdraw/${id}`, formData)
      .then(resp => {
        toast.success('Success approve withdraw!')
        setApprove({ ...approve, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed approve withdraw!\n${err.response.data.message}`)
        setApprove({ ...approve, loading: false, error: true })
      })
  }

  return (
    <Dialog fullWidth maxWidth='xs' fullScreen={!upMd} open={open}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Approve Withdraw</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box id={formId} component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
          <Controller
            control={formHook.control}
            name='proofOfTransfer'
            render={({ field, fieldState }) => (
              <MuiFileInput
                fullWidth
                margin='normal'
                label='Proof of Transfer'
                inputProps={{
                  accept: 'image/*, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx'
                }}
                {...field}
                error={Boolean(fieldState.error)}
                helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button type='submit' form={formId} variant='contained' disabled={approve.loading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
