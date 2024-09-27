'use client'

import { useEffect, useState } from 'react'

import { Avatar, Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'

import UserPageLayout from '../../_components/layout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import toast from 'react-hot-toast'

const creatorDefaultValues = { data: null, loading: false, error: false, success: false }
const followUnfollowDefaultValues = { loading: false, success: false, error: false }

export default function CreatorLayout({ params, children }) {
  const { cUsername } = params
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [creator, setCreator] = useState(creatorDefaultValues)
  const [followUnfollow, setFollowUnfollow] = useState(followUnfollowDefaultValues)

  // * Fetch Creator
  async function fetchCreator() {
    setCreator({ ...creator, loading: true, error: false, success: false })
    await MyAxios.get(`/feeds/creator/${cUsername}`)
      .then(resp => {
        setCreator({ ...creator, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCreator({ ...creator, data: null, loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    if (!!cUsername) fetchCreator()
  }, [cUsername])

  // * Follow Function
  async function followUnfollowCreator() {
    if (creator.success && !!creator.data) {
      setFollowUnfollow({ ...followUnfollow, loading: true, success: false, error: false })
      await MyAxios.put(`/user/relationship/follow/${creator.data.id}`)
        .then(resp => {
          if (resp.data.method === 'CREATE_NEW' || resp.data.method === 'RESTORE') {
            toast.success('Success follow creator!')
          } else if (resp.data.method === 'DESTROY') {
            toast.success('Success unfollow creator!')
          }
          setFollowUnfollow({ ...followUnfollow, loading: false, success: true })
          fetchCreator()
        })
        .catch(err => {
          console.error(err)
          setFollowUnfollow({ ...followUnfollow, loading: false, error: true })
        })
    }
  }

  return (
    <UserPageLayout appbarTitle='Panthreon' contentPadding={0}>
      {creator.loading ? (
        <LoadingSpinner />
      ) : creator.success && !!creator.data ? (
        <Box>
          <Box
            component='img'
            src={creator.data.bannerUrl}
            sx={{ width: '100%', height: upMd ? 260 : 120, objectFit: 'cover', objectPosition: 'top' }}
          />
          <Box sx={{ px: 2, mt: -8 }}>
            <Stack gap={1} justifyContent='center' alignItems='center'>
              <Avatar variant='rounded' src={creator.data.profilePictureUrl} sx={{ width: 120, height: 120 }} />
              <Typography variant='h4' textAlign='center'>
                {creator.data.displayName}
              </Typography>
              <Typography variant='body2' whiteSpace='wrap' textAlign='center'>
                {creator.data.bio}
              </Typography>
              <Typography variant='caption'>{`${intlNumberFormat(creator.data.contentCounts)} content(s)`}</Typography>
              <Button
                size='large'
                variant='contained'
                disabled={followUnfollow.loading}
                onClick={followUnfollowCreator}
              >
                {followUnfollow.loading ? 'Loading...' : !!creator.data.followed ? 'Unfollow' : 'Follow'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ pt: 2 }}>{children}</Box>
        </Box>
      ) : null}
    </UserPageLayout>
  )
}
