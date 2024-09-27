'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Chip,
  Dialog,
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
import { labelBuilder } from '@/utils/labelBuilder'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import CustomViewMode from '@/app/(web)/_components/CustomViewMode'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const withdrawDefaultValues = { data: null, loading: false, error: false, success: false }

export default function DetailWithdrawDialog({ id, open, onClose }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [withdraw, setWithdraw] = useState(withdrawDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setWithdraw({ ...withdraw, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/request-withdraw/${id}`)
      .then(resp => {
        setWithdraw({ ...withdraw, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed load withdraw data!\n${err.response.data.message}`)
        setWithdraw({ ...withdraw, data: null, loading: false, error: true })
        handleClose()
      })
  }

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
  }

  // * On Load
  useEffect(() => {
    if (open && !!id) fetchData()
  }, [open, id])

  return (
    <Dialog fullWidth maxWidth='xs' fullScreen={!upMd} open={open} onClose={handleClose}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Withdraw Detail</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {withdraw.loading ? (
          <LoadingSpinner />
        ) : withdraw.success && !!withdraw.data ? (
          <Stack gap={2}>
            <CustomViewMode label='Bank' value={labelBuilder.Bank(withdraw.data.Bank)} />
            <CustomViewMode label='Account Number' value={withdraw.data.nomorRekening} />
            <CustomViewMode label='Nominal' value={`Rp ${intlNumberFormat(withdraw.data.nominal, true)}`} />
            <CustomViewMode
              label='Status'
              valueComponent={
                <Chip
                  size='small'
                  label={String(withdraw.data.status).toUpperCase()}
                  color={
                    withdraw.data.status === 'on-hold'
                      ? 'warning'
                      : withdraw.data.status === 'approved'
                        ? 'success'
                        : withdraw.data.status === 'declined'
                          ? 'error'
                          : 'default'
                  }
                />
              }
            />
            <CustomViewMode label='Note' valueSx={{ textAlign: 'justify' }} value={withdraw.data.note} />
            {!!withdraw.data.proofOfTransfer && withdraw.data.status === 'approved' ? (
              <CustomViewMode
                label='Proof of Transfer'
                valueComponent={
                  <Avatar
                    variant='square'
                    src={withdraw.data.proofOfTransferUrl}
                    sx={{ width: '100%', height: 'auto' }}
                  />
                }
              />
            ) : null}
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
