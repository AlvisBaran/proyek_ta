'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

import {
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import PinterestIcon from '@mui/icons-material/Pinterest'
import PaymentIcon from '@mui/icons-material/Payment'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const contentRequestDefaultValues = { data: null, loading: false, success: false, error: false }
const addPaymentDefaultValues = { loading: false, success: false, error: false }

export default function AddPaymentDialog({ open, onClose, onSuccess, contentRequestId }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [addPayment, setAddPayment] = useState(addPaymentDefaultValues)
  const [contentRequest, setContentRequest] = useState(contentRequestDefaultValues)

  // * Form Hooks
  const formHook = useForm({
    defaultValues: {
      nominal: 0
    },
    mode: 'onChange'
  })

  // * Fetch Data
  async function fetchContentRequest() {
    setContentRequest({ ...contentRequest, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${contentRequestId}`)
      .then(resp => {
        formHook.setValue('nominal', resp.data.leftoverPrice)
        setContentRequest({ ...contentRequest, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContentRequest({ ...contentRequest, data: null, loading: false, error: true })
        onClose()
      })
  }

  // * On Load
  useEffect(() => {
    if (!!contentRequestId) fetchContentRequest()
  }, [contentRequestId])

  // * On Submit
  async function onSubmit(data) {
    setAddPayment({ ...addPayment, loading: true, error: false, success: false })
    await MyAxios.post(`/user/content-request/${contentRequestId}/payment`, {
      nominal: data.nominal
    })
      .then(resp => {
        toast.success('Success add payment!')
        setAddPayment({ ...addPayment, loading: false, success: true })
        formHook.reset()
        if (!!onSuccess) onSuccess()
        onClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error add payment!\n${err.response.data.message}`)
        setAddPayment({ ...addPayment, loading: false, error: true })
      })
  }

  return (
    <Dialog open={open} fullScreen onClose={onClose}>
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'white' }}>
        <Grid container sx={{ minHeight: '100vh' }}>
          <Grid item xs={12} md={6} sx={{ minHeight: '100vh' }}>
            <Box sx={{ width: '100%', p: upMd ? 2 : 1 }}>
              <PinterestIcon fontSize='large' />
            </Box>
            {contentRequest.loading ? (
              <LoadingSpinner />
            ) : contentRequest.success && !!contentRequest.data ? (
              <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
                <Container maxWidth='xs'>
                  <Typography variant='h4' mt={2} mb={2}>
                    Add Payment
                  </Typography>
                  <Typography variant='body2'>
                    By adding payment to this content request, your balance will automatically reduced as inserted
                    nominal bellow.
                  </Typography>
                  <Typography variant='body2' fontWeight={600} mb={4}>
                    Please proceed with concern!
                  </Typography>
                  <TextField
                    fullWidth
                    type='number'
                    label='Nominal'
                    {...formHook.register('nominal', {
                      required: 'Nominal is required!',
                      max: { value: contentRequest?.data?.leftoverPrice ?? 0, message: 'Payment overpay!' },
                      min: { value: 1, message: 'Payment must not 0 or bellow!' }
                    })}
                    error={Boolean(formHook.formState.errors.nominal)}
                    helperText={
                      Boolean(formHook.formState.errors.nominal) ? formHook.formState.errors.nominal.message : undefined
                    }
                  />
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    disabled={addPayment.loading}
                    startIcon={<AttachMoneyIcon />}
                    sx={{ mt: 2 }}
                  >
                    {addPayment.loading ? 'Loading...' : 'Submit Payment'}
                  </Button>
                  <Button
                    fullWidth
                    variant='text'
                    color='warning'
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 1 }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </Container>
              </Box>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6} sx={{ bgcolor: upMd ? theme.palette.primary.contrastText : undefined }}>
            <Stack alignItems='center' justifyContent='center' height='100%'>
              <Typography variant='h4' textAlign='center'>
                <PinterestIcon fontSize='large' />
                ANTHREON CHECKOUT
              </Typography>
              <Typography variant='h5' textAlign='center'>
                CONTENT REQUEST
              </Typography>
              <Stack direction='row' gap={1} mt={2}>
                <PaymentIcon />
                <MonetizationOnIcon />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}
