'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import PaymentIcon from '@mui/icons-material/Payment'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import MyAxios from '@/hooks/MyAxios'
import Logo from '@/app/(web)/_components/Logo'

const createTopupDefaultValues = { loading: false, success: false, error: false }

export default function CheckoutTopupPage() {
  const router = useRouter()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [createTopup, setCreateTopup] = useState(createTopupDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      nominal: 10000
    },
    mode: 'onChange'
  })

  // * Create Top Up
  async function onSubmit(data) {
    setCreateTopup({ ...createTopup, loading: true, error: false, success: false })
    await MyAxios.post('/user/transaction/topup', {
      nominal: data.nominal
    })
      .then(resp => {
        toast.success('Top up transaction submited!')
        setCreateTopup({ ...createTopup, loading: false, success: false })
        if (!!resp.data.created.mt_payment_link) window.open(resp.data.created.mt_payment_link)
        router.push('/account/top-up')
      })
      .catch(err => {
        console.error(err)
        toast.error(`Top up transaction failed!\n${err.response.data.message}`)
        setCreateTopup({ ...createTopup, loading: false, error: false })
      })
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ minHeight: '100vh' }}>
          <Box sx={{ width: '100%', p: upMd ? 2 : 1 }}>
            <Link href={'/home'}>
              <Logo fontSize='large' />
            </Link>
          </Box>
          <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
            <Container maxWidth='xs'>
              <Typography variant='h4' mb={4}>
                Top Up details
              </Typography>
              <TextField
                fullWidth
                margin='normal'
                type='number'
                label='Nominal'
                placeholder='Insert top-up nominal'
                InputProps={{ startAdornment: <InputAdornment position='start'>Rp </InputAdornment> }}
                {...formHook.register('nominal', {
                  required: 'Nominal is required!',
                  min: { value: 10000, message: 'Minimum top-up 10.000!' }
                })}
                error={Boolean(formHook.formState.errors.nominal)}
                helperText={
                  Boolean(formHook.formState.errors.nominal) ? formHook.formState.errors.nominal.message : undefined
                }
              />

              <Typography variant='body2' color='gray'>
                By submitting top up form, you are going to be redirected to payment page by Midtrans.
              </Typography>

              <Button
                fullWidth
                variant='contained'
                type='submit'
                startIcon={<AttachMoneyIcon />}
                sx={{ mt: 2 }}
                disabled={createTopup.loading}
              >
                {createTopup.loading ? 'Loading...' : 'Submit'}
              </Button>
              <Button
                fullWidth
                variant='text'
                color='warning'
                startIcon={<ArrowBackIcon />}
                LinkComponent={Link}
                href='/account/top-up'
                sx={{ mt: 1 }}
              >
                Cancel
              </Button>
            </Container>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ bgcolor: upMd ? theme.palette.primary.contrastText : undefined }}>
          <Stack alignItems='center' justifyContent='center' height='100%'>
            <Typography variant='h4' textAlign='center'>
              <Logo fontSize='large' />
              ANTHREON CHECKOUT
            </Typography>
            <Typography variant='h5' textAlign='center'>
              TOP UP
            </Typography>
            <Stack direction='row' gap={1} mt={2}>
              <PaymentIcon />
              <MonetizationOnIcon />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
