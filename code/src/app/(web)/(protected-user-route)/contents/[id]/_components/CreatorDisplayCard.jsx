'use client'

import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Avatar, Button, Card, CardActionArea, CardActions, CardHeader, CardMedia } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'

const followUnfollowDefaultValues = { loading: false, success: false, error: false }

export default function CreatorDisplayCard({ creator, onSuccess }) {
  const [followUnfollow, setFollowUnfollow] = useState(followUnfollowDefaultValues)

  // * Follow Function
  async function followUnfollowCreator() {
    if (!!creator) {
      setFollowUnfollow({ ...followUnfollow, loading: true, success: false, error: false })
      await MyAxios.put(`/user/relationship/follow/${creator.id}`)
        .then(resp => {
          if (resp.data.method === 'CREATE_NEW' || resp.data.method === 'RESTORE') {
            toast.success('Success follow creator!')
          } else if (resp.data.method === 'DESTROY') {
            toast.success('Success unfollow creator!')
          }
          setFollowUnfollow({ ...followUnfollow, loading: false, success: true })
          if (!!onSuccess) onSuccess(resp.data.method)
        })
        .catch(err => {
          console.error(err)
          setFollowUnfollow({ ...followUnfollow, loading: false, error: true })
        })
    }
  }

  return (
    <Card elevation={3}>
      <CardActionArea LinkComponent={Link} href={`/c/${creator.cUsername}/home`}>
        <CardMedia component='img' src={creator.bannerUrl} sx={{ aspectRatio: '9:16', height: 80 }} />
        <CardHeader
          avatar={<Avatar src={creator.profilePictureUrl} />}
          title={creator.displayName}
          subheader={creator.bio}
        />
      </CardActionArea>
      <CardActions>
        <Button fullWidth variant='contained' disabled={followUnfollow.loading} onClick={followUnfollowCreator}>
          {followUnfollow.loading ? 'Loading...' : !!creator.followed ? 'Unfollow' : 'Follow'}
        </Button>
      </CardActions>
    </Card>
  )
}
