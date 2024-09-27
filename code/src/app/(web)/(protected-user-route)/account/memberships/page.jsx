'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Avatar, Card, CardHeader, Chip, Stack } from '@mui/material'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import MyAxios from '@/hooks/MyAxios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const membershipsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function UserAccountMembershipsPage() {
  const router = useRouter()
  const [memberships, setMemberships] = useState(membershipsDefaultValues)

  // * Fetch Memberships
  async function fetchMemberships() {
    setMemberships({ ...memberships, loading: true, error: false, success: false })
    await MyAxios.get(`/user/transaction/buy-membership`)
      .then(resp => {
        setMemberships({ ...memberships, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMemberships({ ...memberships, data: [], loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    fetchMemberships()
  }, [])

  return (
    <UserPageLayout appbarTitle='Memberships'>
      <AccountLayout activeNav='memberships'>
        {memberships.loading ? (
          <LoadingSpinner />
        ) : memberships.success ? (
          <Stack gap={1} mt={2}>
            {memberships.data?.length <= 0 ? (
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar>
                      <QuestionMarkIcon />
                    </Avatar>
                  }
                  title='Oops!'
                  subheader='No purchased memberships yet! :('
                />
              </Card>
            ) : null}
            {memberships.data?.map((item, index) => (
              <Card elevation={3} key={`user-account-memberships-item-${index}`}>
                <CardHeader
                  avatar={
                    <Link href={`/c/${item.Membership?.User?.cUsername}`}>
                      <Avatar src={item.Membership?.User?.profilePictureUrl} />
                    </Link>
                  }
                  title={`${item.Membership?.name} by ${item.Membership?.User?.displayName}`}
                  titleTypographyProps={{
                    fontWeight: 600,
                    onClick: () => router.push(`/c/${item.Membership?.User?.cUsername}/membership`),
                    sx: { cursor: 'pointer' }
                  }}
                  subheader={`expired ${dayjs(item.expiredAt).fromNow()}`}
                  subheaderTypographyProps={{ variant: 'body2' }}
                  action={
                    <Chip
                      size='small'
                      color={(() => {
                        const value = dayjs().diff(dayjs(item.expiredAt), 'days')
                        if (value === 0) return 'warning'
                        else if (value > 0) return 'error'
                        else if (value < 0) return 'success'
                        else return 'default'
                      })()}
                      label={(() => {
                        const value = dayjs().diff(dayjs(item.expiredAt), 'days')
                        if (value === 0) return 'last day'
                        else if (value > 0) return 'expired'
                        else if (value < 0) return 'active'
                        else return ''
                      })()}
                    />
                  }
                />
              </Card>
            ))}
          </Stack>
        ) : null}
      </AccountLayout>
    </UserPageLayout>
  )
}
