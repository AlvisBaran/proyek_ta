'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Avatar, Card, CardActionArea, CardHeader, Stack } from '@mui/material'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import SourceIcon from '@mui/icons-material/Source'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'
import UserAccountTopupHistoryDetailDialog from './_components/TopUpDetailDialog'

const topupHistoryDefaultValues = { data: [], loading: false, error: false, success: false }
const detailValuesDefaultValues = { invoice: null, open: false }

export default function UserAccountTopupHistoryPage() {
  const [topupHistory, setTopupHistory] = useState(topupHistoryDefaultValues)
  const [detailValues, setDetailValues] = useState(detailValuesDefaultValues)

  // * Fetch Top up History
  async function fetchTopupHistory() {
    setTopupHistory({ ...topupHistory, loading: true, error: false, success: false })
    await MyAxios.get(`/user/transaction/topup`)
      .then(resp => {
        setTopupHistory({ ...topupHistory, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setTopupHistory({ ...topupHistory, data: [], loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    fetchTopupHistory()
  }, [])

  return (
    <UserPageLayout appbarTitle='Top-up'>
      <AccountLayout activeNav='top-up'>
        {topupHistory.loading ? (
          <LoadingSpinner />
        ) : topupHistory.success ? (
          <Stack gap={1} mt={2}>
            {topupHistory.data?.length <= 0 ? (
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar>
                      <QuestionMarkIcon />
                    </Avatar>
                  }
                  title='Oops!'
                  subheader='No Top Up history yet! :('
                />
              </Card>
            ) : null}
            {topupHistory.data?.map((history, index) => (
              <Card key={`user-account-top-up-item-${index}`} elevation={3}>
                <CardActionArea onClick={() => setDetailValues({ invoice: history.invoice, open: true })}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor:
                            history.status === 'success'
                              ? 'success.main'
                              : history.status === 'failed'
                                ? 'error.main'
                                : 'warning.main'
                        }}
                      >
                        {history.status === 'success' ? (
                          <CheckCircleOutlineIcon />
                        ) : history.status === 'failed' ? (
                          <ErrorOutlineIcon />
                        ) : (
                          <HourglassTopIcon />
                        )}
                      </Avatar>
                    }
                    title={`Rp ${intlNumberFormat(history.nominal, true)} [${history.invoice}]`}
                    titleTypographyProps={{ fontWeight: 600 }}
                    subheader={dayjs(history.createdAt).format(formatDateTime)}
                    action={<SourceIcon />}
                  />
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        ) : null}

        <UserAccountTopupHistoryDetailDialog
          invoice={detailValues.invoice}
          open={detailValues.open}
          onClose={() => setDetailValues(detailValuesDefaultValues)}
          onReload={fetchTopupHistory}
        />
      </AccountLayout>
    </UserPageLayout>
  )
}
