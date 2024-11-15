'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { labelBuilder } from '@/utils/labelBuilder'
import CustomViewMode from '@/app/(web)/_components/CustomViewMode'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { WITHDRAW_LIMIT } from '@/utils/constants'

const formId = 'creator-withdraw-add-form'
const createWithdrawDefaultValues = { loading: false, error: false, success: false }
const banksDefaultValues = { data: [], loading: false, error: false, success: false }
const saldoDefaulValues = { data: null, loading: false, error: false, success: false }

export default function AddWithdrawDialog({ open, onClose, onSuccess }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [create, setCreate] = useState(createWithdrawDefaultValues)
  const [saldo, setSaldo] = useState(saldoDefaulValues)
  const [banks, setBanks] = useState(banksDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      nomorRekening: '',
      bank: null,
      nominal: WITHDRAW_LIMIT.MIN
    },
    mode: 'onChange'
  })

  // * Fetch Banks
  async function fetchBanks() {
    setBanks({ ...banks, loading: true, error: false, success: false })
    await MyAxios.get('/bank')
      .then(resp => {
        setBanks({ ...banks, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed load banks data!\n${err.response.data.message}`)
        setBanks({ ...banks, data: [], loading: false, error: true })
      })
  }

  // * Fetch Saldo
  async function fetchSaldo() {
    setSaldo({ ...saldo, loading: true, error: false, success: false })
    await MyAxios.get('/user/balance')
      .then(resp => {
        setSaldo({ ...saldo, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed load user balance!\n${err.response.data.message}`)
        setSaldo({ ...saldo, data: [], loading: false, error: true })
      })
  }

  // * On Close
  function handleClose() {
    formHook.reset()
    if (!!onClose) onClose()
  }

  // * On Submit
  async function onSubmit(data) {
    setCreate({ ...create, loading: true, success: false, error: false })
    await MyAxios.post('/creator/request-withdraw', {
      nomorRekening: data.nomorRekening,
      bankRef: data.bank.id,
      nominal: data.nominal
    })
      .then(resp => {
        toast.success('Success request withdraw!')
        setCreate({ ...create, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed request withdraw!\n${err.response.data.message}`)
        setCreate({ ...create, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (open) {
      fetchBanks()
      fetchSaldo()
    }
  }, [open])

  return (
    <Dialog fullWidth maxWidth='xs' fullScreen={!upMd} open={open}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Request a Withdraw</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)}>
          <CustomViewMode label='Current Balance' value={`Rp ${intlNumberFormat(saldo.data ?? 0, false)}`} />
          <Controller
            control={formHook.control}
            name='bank'
            render={({ field, fieldState }) => (
              <Autocomplete
                fullWidth
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={banks.loading}
                getOptionLabel={option => labelBuilder.Bank(option)}
                options={banks.data ?? []}
                renderInput={({ InputLabelProps, ...params }) => (
                  <TextField
                    margin='normal'
                    {...params}
                    InputLabelProps={{ ...InputLabelProps, shrink: true }}
                    label='Bank'
                    placeholder='Select a bank'
                    error={Boolean(fieldState.error)}
                    helperText={Boolean(fieldState.error) ? fieldState.error.message : undefined}
                  />
                )}
                value={field.value}
                onChange={(e, newValue) => field.onChange(newValue)}
              />
            )}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Account Number'
            placeholder='Type your bank account number'
            {...formHook.register('nomorRekening', {
              required: 'Account Number is required!',
              pattern: { value: /^[0-9]*$/, message: 'Invalid account number!' }
            })}
            error={Boolean(formHook.formState.errors.nomorRekening)}
            helperText={
              Boolean(formHook.formState.errors.nomorRekening)
                ? formHook.formState.errors.nomorRekening.message
                : undefined
            }
          />
          <TextField
            fullWidth
            margin='normal'
            type='number'
            label='Nominal'
            placeholder='Type your withdraw nominal'
            InputProps={{ startAdornment: <InputAdornment position='start'>Rp</InputAdornment> }}
            inputProps={{
              min: WITHDRAW_LIMIT.MIN,
              max: saldo.data > WITHDRAW_LIMIT.MAX ? WITHDRAW_LIMIT.MAX : saldo.data
            }}
            {...formHook.register('nominal', {
              required: 'Nominal is required!',
              min: { value: WITHDRAW_LIMIT.MIN, message: `Minimum of ${intlNumberFormat(WITHDRAW_LIMIT.MIN)}!` },
              max: {
                value: saldo.data > WITHDRAW_LIMIT.MAX ? WITHDRAW_LIMIT.MAX : saldo.data,
                message:
                  saldo.data > WITHDRAW_LIMIT.MAX
                    ? 'You are exceeding withdraw maximum nominal!'
                    : 'Your current balance is yor maximum!'
              }
            })}
            error={Boolean(formHook.formState.errors.nominal)}
            helperText={
              Boolean(formHook.formState.errors.nominal) ? formHook.formState.errors.nominal.message : undefined
            }
          />
          <Typography color='gray' variant='body2'>
            Minimum withdrawal: Rp {intlNumberFormat(WITHDRAW_LIMIT.MIN)}
          </Typography>
          <Typography color='gray' variant='body2'>
            Maximum withdrawal: Rp {intlNumberFormat(WITHDRAW_LIMIT.MAX)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' type='submit' form={formId} disabled={create.loading || saldo.loading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
