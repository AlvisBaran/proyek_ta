'use client'

import { useEffect, useState } from 'react'

import {
  Avatar,
  Button,
  Card,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import UserPageLayout from '@/app/(web)/(protected-user-route)/_components/layout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/dayjsConst'
import toast from 'react-hot-toast'
import SearchUserDialog from '@/app/(web)/_components/user-ui/SearchUserDialog'

const membersDefaultValues = { data: [], loading: false, success: false, error: false }
const removingMemberDefaultValues = { loading: false, success: false, error: false }
const addingMemberDefaultValues = { loading: false, success: false, error: false }

export default function UserRequestContentDetailMembersPage({ params }) {
  const contentRequestId = params.id
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const { pushConfirm } = useDialog()
  const [members, setMembers] = useState(membersDefaultValues)
  const [removingMember, setRemovingMember] = useState(removingMemberDefaultValues)
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false)
  const [addingMember, setAddingMember] = useState(addingMemberDefaultValues)

  // * Fetch Data
  async function fetchMembers() {
    setMembers({ ...members, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${contentRequestId}/member`)
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
    if (!!contentRequestId) fetchMembers()
  }, [contentRequestId])

  // * Remove Member
  async function removeMember(memberId) {
    setRemovingMember({ ...removingMember, loading: true, error: false, success: false })
    await MyAxios.delete(`/user/content-request/${contentRequestId}/member/${memberId}`)
      .then(resp => {
        toast.success('Success remove member!')
        setRemovingMember({ ...removingMember, loading: false, success: true })
        fetchMembers()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error removing member!\n${err.response.data.message}`)
        setRemovingMember({ ...removingMember, loading: false, error: true })
      })
  }

  // * Add Member
  async function addMember(userId) {
    setAddingMember({ ...addingMember, loading: true, error: false, success: false })
    await MyAxios.post(`/user/content-request/${contentRequestId}/member`, {
      userId
    })
      .then(resp => {
        toast.success('Success add member!')
        setAddingMember({ ...addingMember, loading: false, success: true })
        setOpenAddMemberDialog(false)
        fetchMembers()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error adding member!\n${err.response.data.message}`)
        setAddingMember({ ...addingMember, loading: false, error: true })
      })
  }

  return (
    <UserPageLayout appbarTitle='Members'>
      {members.loading ? (
        <LoadingSpinner />
      ) : members.success ? (
        <Container maxWidth='sm'>
          <Stack gap={2}>
            <Stack direction='row' justifyContent='end' gap={upMd ? 2 : 1} flexWrap='wrap'>
              <Button
                fullWidth={!upMd}
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => setOpenAddMemberDialog(true)}
              >
                Add Member
              </Button>
            </Stack>
            <Card elevation={3}>
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
                  <ListItem
                    key={`request-content-detail-members-list-item-${index}`}
                    secondaryAction={
                      <IconButton
                        color='error'
                        onClick={() =>
                          pushConfirm({
                            title: 'Remove Member?',
                            content: 'Are you sure to remove this member?',
                            onAgreeBtnClick: () => removeMember(member.id)
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
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
          </Stack>
        </Container>
      ) : null}

      <SearchUserDialog
        open={openAddMemberDialog}
        onClose={() => setOpenAddMemberDialog(false)}
        setUser={newValue => {
          if (!!newValue && !!newValue.id) addMember(newValue.id)
        }}
      />
    </UserPageLayout>
  )
}
