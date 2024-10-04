'use client'

import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'

import Person4Icon from '@mui/icons-material/Person4'

import MyAxios from '@/hooks/MyAxios'
import { range } from '@/utils/mathHelper'

const followingsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function FollowedCreatorSection() {
  const [followings, setFollowings] = useState(followingsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setFollowings({ ...followings, loading: true, success: false, error: false })
    await MyAxios.get('/user/relationship/follow', { params: { limit: 6 } })
      .then(resp => {
        setFollowings({ ...followings, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to load followed creator!\n${err.response.data.message}`)
        setFollowings({ ...followings, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container maxWidth='lg'>
      <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2} mb={1}>
        <Stack direction='row' alignItems='center' gap={1} sx={{ color: 'GrayText' }}>
          <Person4Icon />
          <Typography variant='h6'>Followed Creator</Typography>
        </Stack>
        <Button LinkComponent={Link} href='/account/following'>
          See All
        </Button>
      </Stack>
      <Grid container spacing={2}>
        {followings.loading ? (
          <Fragment>
            {range({ max: 3 }).map(item => (
              <Grid key={`home-followed-creator-skeleton-card-${item}`} item xs={12} md={4} lg={3} xl={2}>
                <Card elevation={3}>
                  <CardHeader
                    avatar={<Skeleton variant='circular' height={38} width={38} />}
                    title={<Skeleton variant='text' width={48} />}
                    subheader={<Skeleton variant='text' width={78} />}
                  />
                </Card>
              </Grid>
            ))}
          </Fragment>
        ) : followings.success ? (
          <Fragment>
            {followings.data.map((following, index) => (
              <Grid key={`home-followed-creator-card-${index}`} item xs={12} md={4} lg={3} xl={2}>
                <Card elevation={3}>
                  <CardActionArea LinkComponent={Link} href={`/c/${following.Followed.cUsername}`}>
                    <CardHeader
                      avatar={<Avatar src={following.Followed.profilePictureUrl} />}
                      title={following.Followed.displayName}
                      subheader={following.Followed.cUsername}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Fragment>
        ) : null}
      </Grid>
    </Container>
  )
}
