'use client'

import { useEffect, useState } from 'react'

import { Box, Container, Grid, Skeleton } from '@mui/material'

import CreatorPageTabs from '../_components/CreatorPageTabs'
import MembershipCard from '@/app/(web)/_components/membership-ui/MembershipCard'

import MyAxios from '@/hooks/MyAxios'
import { range } from '@/utils/mathHelper'

const membershipsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorMembershipPage({ params }) {
  const { cUsername } = params
  const [memberships, setMemberships] = useState(membershipsDefaultValues)

  // * Fetch Memberships
  async function fetchMemberships() {
    setMemberships({ ...memberships, loading: true, error: false, success: false })
    await MyAxios.get(`/feeds/creator/${cUsername}/membership`)
      .then(resp => {
        setMemberships({ ...memberships, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMemberships({ ...memberships, data: null, loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    if (!!cUsername) fetchMemberships()
  }, [cUsername])

  return (
    <Box>
      <CreatorPageTabs cUsername={cUsername} value='membership' />
      <Container maxWidth='md' sx={{ py: 4, pb: 8 }}>
        {memberships.loading ? (
          <Grid container spacing={2}>
            {range({ max: 3 }).map(item => (
              <Grid key={item} item xs={12} md={4}>
                <Skeleton variant='rounded' width='100%' height={360} />
              </Grid>
            ))}
          </Grid>
        ) : memberships.success ? (
          <Grid container spacing={2}>
            {memberships.data?.map((membership, index) => (
              <Grid key={`c-${cUsername}-memberships-item-${index}`} item xs={12} md={4}>
                <MembershipCard membership={membership} />
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Container>
    </Box>
  )
}
