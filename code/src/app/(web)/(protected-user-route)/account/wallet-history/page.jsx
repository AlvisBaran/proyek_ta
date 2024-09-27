'use client'

import { useEffect, useState } from 'react'

import { Avatar, Card, CardContent, CardHeader, Collapse, IconButton, Stack, Typography } from '@mui/material'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import MyAxios from '@/hooks/MyAxios'
import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'

const walletHistoryDefaultValues = { data: [], loading: false, error: false, success: false }

export default function UserAccountWalletHistoryPage() {
  const [walletHistory, setWalletHistory] = useState(walletHistoryDefaultValues)

  // * Fetch Wallet History
  async function fetchWalletHistory() {
    setWalletHistory({ ...walletHistory, loading: true, error: false, success: false })
    await MyAxios.get(`/user/wallet-history`)
      .then(resp => {
        setWalletHistory({ ...walletHistory, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setWalletHistory({ ...walletHistory, data: [], loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    fetchWalletHistory()
  }, [])

  return (
    <UserPageLayout appbarTitle='Wallet History'>
      <AccountLayout activeNav='wallet-history'>
        {walletHistory.loading ? (
          <LoadingSpinner />
        ) : walletHistory.success ? (
          <Stack gap={1} mt={2}>
            {walletHistory.data?.length <= 0 ? (
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar>
                      <QuestionMarkIcon />
                    </Avatar>
                  }
                  title='Oops!'
                  subheader='No wallet history yet! :('
                />
              </Card>
            ) : null}
            {walletHistory.data?.map((history, index) => (
              <WalletHistoryCard key={`user-account-wallet-history-item-${index}`} history={history} />
            ))}
          </Stack>
        ) : null}
      </AccountLayout>
    </UserPageLayout>
  )
}

function WalletHistoryCard({ history }) {
  const [open, setOpen] = useState(false)

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: history.type === 'in' ? 'success.main' : history.type === 'out' ? 'error.main' : undefined
            }}
          >
            {history.type === 'in' ? <ArrowCircleDownIcon /> : history.type === 'out' ? <ArrowCircleUpIcon /> : null}
          </Avatar>
        }
        title={history.title}
        subheader={dayjs(history.createdAt).format(formatDateTime)}
        action={
          <IconButton size='medium' onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <Collapse in={open} timeout='auto' unmountOnExit>
        <CardContent sx={{ p: 0, pl: 9, pr: 2 }}>
          <Typography variant='body2' textAlign='justify'>
            {history.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
