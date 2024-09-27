'use client'

import { useEffect, useState } from 'react'

import { Avatar, Card, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import CreatorRequestContentLayout, { creatorRequestContentNavs } from '../_components/CreatorRequestContentLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'

const activeNav = 'members'
const membersDefaultValues = { data: [], loading: false, success: false, error: false }

export default function CreatorRequestContentDetailMembersPage({ params }) {
  const id = params.id
  const currNav = creatorRequestContentNavs.find(item => item.value === activeNav)

  const [members, setMembers] = useState(membersDefaultValues)

  // * Fetch Members
  async function fetchMembers() {
    setMembers({ ...members, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${id}/member`)
      .then(resp => {
        setMembers({ ...members, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMembers({ ...members, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!id) fetchMembers()
  }, [id])

  return (
    <CreatorRequestContentLayout activeNav={activeNav} id={id}>
      {members.loading ? (
        <LoadingSpinner />
      ) : members.success ? (
        <Card elevation={3} sx={{ mt: 2 }}>
          <CardHeader
            title={currNav.label}
            titleTypographyProps={{ variant: 'h6' }}
            subheader={currNav.subTitle}
            subheaderTypographyProps={{ variant: 'body2' }}
          />
          <Divider />
          <List dense>
            {members.data.length <= 0 ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QuestionMarkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Oops!' secondary='There are no member yet! :(' />
              </ListItem>
            ) : null}
            {members.data?.map((member, index) => (
              <ListItem key={`creator-request-content-detail-members-list-item-${index}`}>
                <ListItemAvatar>
                  <Avatar src={member.User.profilePictureUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.User.displayName}
                  secondary={dayjs(member.createdAt).format(formatDateTime)}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      ) : null}
    </CreatorRequestContentLayout>
  )
}
