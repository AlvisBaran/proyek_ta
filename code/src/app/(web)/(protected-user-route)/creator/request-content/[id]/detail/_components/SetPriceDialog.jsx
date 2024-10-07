'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField
} from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'

const formId = 'creator-content-request-set-price-form'
const setPriceDefaultValues = { loading: false, error: false, success: false }
const PERSENTASE_ADMIN = 3

export default function SetPriceDialog({ open, onClose, onSuccess, contentRequest }) {
  const [setPrice, setSetPrice] = useState(setPriceDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      price: 0
    },
    mode: 'onChange'
  })
  const priceWatcher = Number(formHook.watch('price') ?? 0)

  // * On Load
  useEffect(() => {
    if (open)
      formHook.reset({
        price: contentRequest.price ?? 0
      })
  }, [open, contentRequest])

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
    formHook.reset()
  }

  // * On Submit
  async function onSubmit(data) {
    setSetPrice({ ...setPrice, loading: true, error: false, success: false })
    await MyAxios.put(`/creator/content-request/${contentRequest.id}/set-price`, {
      price: data.price
    })
      .then(resp => {
        toast.success('Success set price!')
        setSetPrice({ ...setPrice, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error set price!\n${err.response.data.message}`)
        setSetPrice({ ...setPrice, loading: false, error: true })
      })
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Set Price</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nominal you get when finished will be cut by {intlNumberFormat(PERSENTASE_ADMIN, true)}% as admin fee.
        </DialogContentText>
        <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)} autoComplete='off'>
          <TextField
            fullWidth
            margin='normal'
            label='Price'
            InputProps={{ startAdornment: <InputAdornment position='start'>Rp</InputAdornment> }}
            {...formHook.register('price', {
              required: 'Price is required!',
              min: { value: 1000, message: 'Minimal value of 1000!' }
            })}
            error={Boolean(formHook.formState.errors.price)}
            helperText={Boolean(formHook.formState.errors.price) ? formHook.formState.errors.price.message : undefined}
          />
        </Box>
        <DialogContentText>
          Nominal you get: Rp{' '}
          {intlNumberFormat(priceWatcher - Math.floor((priceWatcher * PERSENTASE_ADMIN) / 100), true)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' type='reset' onClick={handleClose}>
          Cancel
        </Button>
        <Button type='submit' form={formId} variant='contained' disabled={setPrice.loading}>
          {setPrice.loading ? 'Loading...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
