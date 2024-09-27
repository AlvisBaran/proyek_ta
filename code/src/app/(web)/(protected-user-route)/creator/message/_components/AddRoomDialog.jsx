'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const usersDefaultValues = { data: [], loading: false, error: false, success: false }
const createRoomDefaultValues = { loading: false, error: false, success: false }

export default function AddRoomDialog({ open, onClose, onSuccess }) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [users, setUsers] = useState(usersDefaultValues)
  const [createRoom, setCreateRoom] = useState(createRoomDefaultValues)

  // * Fatch Users
  async function fetchUsers() {
    setUsers({ ...users, loading: true, error: false, success: false })
    await MyAxios.get('/user/messaging/users', { params: { keyword: searchValue } })
      .then(resp => {
        setUsers({ ...users, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setUsers({ ...users, data: [], loading: false, error: true })
      })
  }

  // * On User is selected
  async function createNewRoom(selectedUser) {
    setCreateRoom({ ...createRoom, loading: true, error: false, success: false })
    await MyAxios.post('/user/messaging', { user2Id: selectedUser.id })
      .then(resp => {
        toast.success('Success create room!')
        setCreateRoom({ ...createRoom, loading: false, success: true })
        onSuccess(resp.data?.newValues)
        handleClose()
      })
      .catch(err => {
        console.error(err)
        if (err.response.data.code === 'ROOM_ALREADY_EXISTS') {
          toast.success('Room is already created!')
          setCreateRoom({ ...createRoom, loading: false, success: true })
          onSuccess(err.response.data.roomData)
          handleClose()
        } else {
          toast.error(`Failed create room!\n${err.response.data.message}`)
          setCreateRoom({ ...createRoom, loading: false, error: true })
        }
      })
  }

  // * On Load & On Search change
  useEffect(() => {
    if (open) fetchUsers()
  }, [open, searchValue])

  // * On Close
  function handleClose() {
    onClose()
    setSearchTerm('')
  }

  return (
    <Dialog fullWidth maxWidth='xs' open={open}>
      <DialogTitle>
        <Stack direction='row' gap={2} justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>New Message</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant='outlined'
          size='small'
          placeholder='Search user'
          autoComplete='off'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Divider />
        {users.loading ? (
          <LoadingSpinner />
        ) : users.success ? (
          <List dense>
            {users.data?.length <= 0 ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QuestionMarkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Oops!' secondary={`No user goes by "${searchValue}"!`} />
              </ListItem>
            ) : null}
            {users.data?.map((user, index) => (
              <ListItemButton
                key={`creator-message-add-room-dialog-users-${index}`}
                disabled={createRoom.loading}
                onClick={() => createNewRoom(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePictureUrl} />
                </ListItemAvatar>
                <ListItemText primary={user.displayName} secondary={user.cUsername} />
              </ListItemButton>
            ))}
          </List>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
