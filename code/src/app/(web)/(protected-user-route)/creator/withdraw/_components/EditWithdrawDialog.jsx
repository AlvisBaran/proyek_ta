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
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const formId = 'creator-withdraw-edit-form'
const withdrawDefaultValues = { data: null, loading: false, error: false, success: false }
const editWithdrawDefaultValues = { loading: false, error: false, success: false }
const banksDefaultValues = { data: [], loading: false, error: false, success: false }

export default function EditWithdrawDialog({ id, open, onClose, onSuccess }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [withdraw, setWithdraw] = useState(withdrawDefaultValues)
  const [edit, setEdit] = useState(editWithdrawDefaultValues)
  const [banks, setBanks] = useState(banksDefaultValues)

  // * Form Hook
  const formHook = useForm({
    defaultValues: {
      nomorRekening: '',
      bank: null
    },
    mode: 'onChange'
  })

  // * Fetch Data
  async function fetchData() {
    setWithdraw({ ...withdraw, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/request-withdraw/${id}`)
      .then(resp => {
        formHook.reset({
          nomorRekening: resp.data.nomorRekening,
          bank: resp.data.Bank ?? null
        })
        setWithdraw({ ...withdraw, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed load withdraw data!\n${err.response.data.message}`)
        setWithdraw({ ...withdraw, data: null, loading: false, error: true })
        handleClose()
      })
  }

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

  // * On Close
  function handleClose() {
    formHook.reset()
    if (!!onClose) onClose()
  }

  // * On Submit
  async function onSubmit(data) {
    setEdit({ ...edit, loading: true, success: false, error: false })
    await MyAxios.put(`/creator/request-withdraw/${id}`, {
      nomorRekening: data.nomorRekening,
      bankRef: data.bank.id
    })
      .then(resp => {
        toast.success('Success update request withdraw!')
        setEdit({ ...edit, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed update request withdraw!\n${err.response.data.message}`)
        setEdit({ ...edit, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (open && !!id) {
      fetchData()
      fetchBanks()
    }
  }, [open, id])

  return (
    <Dialog fullWidth maxWidth='xs' fullScreen={!upMd} open={open} onClose={handleClose}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Withdraw Edit</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {withdraw.loading ? (
          <LoadingSpinner />
        ) : withdraw.success && !!withdraw.data ? (
          <Box component='form' id={formId} onSubmit={formHook.handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin='normal'
              label='Nominal'
              disabled
              InputProps={{ startAdornment: <InputAdornment position='start'>Rp</InputAdornment> }}
              value={intlNumberFormat(withdraw.data.nominal, true)}
            />
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
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button type='submit' form={formId} variant='contained' disabled={edit.loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
