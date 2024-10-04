'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import CustomViewMode from '@/app/(web)/_components/CustomViewMode'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'

const transactionDefaulValues = { data: null, loading: false, error: false, success: false }

export default function UserAccountTopupHistoryDetailDialog({ invoice, open, onClose, onReload }) {
  const [transaction, setTransaction] = useState(transactionDefaulValues)

  // * Fetch Data
  async function fetchData() {
    setTransaction({ ...transaction, loading: true, error: false, success: false })
    await MyAxios.get(`/user/transaction/topup/${invoice}`)
      .then(resp => {
        setTransaction({ ...transaction, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setTransaction({ ...transaction, data: null, loading: false, error: true })
        toast.error(`Failed to load transaction data!\n${err.response.data.message}`)
        handleClose()
      })
  }

  // * On Close
  function handleClose() {
    if (!!onReload) onReload()
    if (!!onClose) onClose()
  }

  // * On Load
  useEffect(() => {
    if (!!invoice && open) fetchData()
  }, [invoice, open])

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogTitle>
        <Stack direction='row' gap={2} justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>Top Up Detail</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      {transaction.loading ? (
        <LoadingSpinner />
      ) : transaction.success && !!transaction.data ? (
        <Fragment>
          <DialogContent>
            <Stack gap={2}>
              <CustomViewMode label='Invoice' value={transaction.data.invoice} />
              <CustomViewMode label='Nominal' value={`Rp ${intlNumberFormat(transaction.data.nominal, true)}`} />
              <CustomViewMode
                label='Status'
                valueComponent={
                  <Chip
                    label={String(transaction.data.status).toUpperCase()}
                    color={
                      transaction.data.status === 'success'
                        ? 'success'
                        : transaction.data.status === 'failed'
                          ? 'error'
                          : 'warning'
                    }
                  />
                }
              />
              <CustomViewMode label='Create Date' value={dayjs(transaction.data.createdAt).format(formatDateTime)} />
            </Stack>
          </DialogContent>

          {transaction.data.status === 'pending' ? (
            <DialogActions>
              <Button variant='contained' color='info' onClick={() => window.open(transaction.data.mt_payment_link)}>
                Payment Link
              </Button>
            </DialogActions>
          ) : null}
        </Fragment>
      ) : null}
    </Dialog>
  )
}
