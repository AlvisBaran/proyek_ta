'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import UserPageLayout from '../../_components/layout'
import AccountLayout from '../_components/AccountLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'

const followingsDefaultValues = { data: [], loading: false, success: false, error: false }

export default function UserAccountFollowingPage() {
  const [followings, setFollowings] = useState(followingsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setFollowings({ ...followings, loading: true, success: false, error: false })
    await MyAxios.get('/user/relationship/follow')
      .then(resp => {
        setFollowings({ ...followings, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setFollowings({ ...followings, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <UserPageLayout appbarTitle='Following'>
      <AccountLayout activeNav='following'>
        {followings.loading ? (
          <LoadingSpinner />
        ) : followings.success ? (
          <List>
            {followings.data?.map((following, index) => (
              <FollowedCreatorListItem
                key={`account-following-item-${index}`}
                following={following}
                refetchData={fetchData}
              />
            ))}
            {followings.data.length <= 0 ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QuestionMarkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Oops!' secondary='You have not followed any creator yet!' />
              </ListItem>
            ) : null}
          </List>
        ) : null}
      </AccountLayout>
    </UserPageLayout>
  )
}

const unfollowDefaultValues = { loading: false, success: false, error: false }

function FollowedCreatorListItem({ following, refetchData }) {
  const router = useRouter()
  const { pushConfirm } = useDialog()
  const [unfollow, setUnfollow] = useState(unfollowDefaultValues)

  // * Unfollow Function
  async function unfollowCreator() {
    setUnfollow({ ...unfollow, loading: true, success: false, error: false })
    await MyAxios.put(`/user/relationship/follow/${following.followedRef}`)
      .then(resp => {
        if (resp.data.method === 'CREATE_NEW' || resp.data.method === 'RESTORE') {
          toast.success('Success follow creator!')
        } else if (resp.data.method === 'DESTROY') {
          toast.success('Success unfollow creator!')
        }
        setUnfollow({ ...unfollow, loading: false, success: true })
        if (!!refetchData) refetchData()
      })
      .catch(err => {
        console.error(err)
        setUnfollow({ ...unfollow, loading: false, error: true })
      })
  }

  function gotoCreatorPage() {
    if (!!following && !!following.Followed) router.push(`/c/${following?.Followed?.cUsername}`)
  }

  return (
    <ListItem
      secondaryAction={
        <Button
          size='small'
          variant='outlined'
          onClick={() =>
            pushConfirm({
              title: 'Unfollow Creator',
              content: 'Are you sure to unfollow?',
              onAgreeBtnClick: unfollowCreator
            })
          }
        >
          Unfollow
        </Button>
      }
    >
      <ListItemAvatar sx={{ cursor: 'pointer' }} onClick={gotoCreatorPage}>
        <Avatar src={following?.Followed?.profilePictureUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={following?.Followed?.cUsername}
        secondary={following?.Followed?.displayName}
        sx={{ cursor: 'pointer' }}
        onClick={gotoCreatorPage}
        // secondary={`Since: ${dayjs(following.createdAt).format(formatDateTime)}`}
        // secondaryTypographyProps={{ variant: 'caption' }}
        // secondary={following?.Followed?.bio}
      />
    </ListItem>
  )
}
