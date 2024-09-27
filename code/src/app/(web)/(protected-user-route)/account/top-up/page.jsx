'use client'

import { useEffect, useState } from 'react'

import { Avatar, Card, CardContent, CardHeader, Collapse, IconButton, Stack, Typography } from '@mui/material'

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

const topupHistoryDefaultValues = { data: [], loading: false, error: false, success: false }

export default function UserAccountTopupHistoryPage() {
  const [topupHistory, setTopupHistory] = useState(topupHistoryDefaultValues)
  console.log(topupHistory.data)
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
            {/* {topupHistory.data?.length <= 0 ? <div>...</div> : null}
            {topupHistory.data?.map((history, index) => (
              <WalletHistoryCard key={`user-account-top-up-item-${index}`} history={history} />
            ))} */}
          </Stack>
        ) : null}
      </AccountLayout>
    </UserPageLayout>
  )
}
