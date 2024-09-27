'use client'

import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const usersDefaultValues = { data: [], loading: false, error: false, success: false }

export default function SearchUserDialog({ open, onClose, setUser }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [users, setUsers] = useState(usersDefaultValues)

  // * Fetch Data
  async function fetchUserData() {
    setUsers({ ...users, loading: true, error: false, success: false })
    await MyAxios.get('/user/search', {
      params: {
        keyword: searchValue
      }
    })
      .then(res => {
        setUsers({ ...users, data: res.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setUsers({ ...users, data: [], loading: false, error: true })
      })
  }

  useEffect(() => {
    if (!!searchValue) fetchUserData()
  }, [searchValue])

  return (
    <Dialog open={open} fullWidth fullScreen={!upMd} maxWidth='sm' onClose={onClose}>
      <DialogTitle>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5'>Select a user</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box py={1}>
          <TextField
            fullWidth
            size='small'
            label='Search'
            autoComplete='off'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Box>
        {users.loading ? (
          <LoadingSpinner />
        ) : users.success ? (
          <List disablePadding>
            {users.data?.map((item, index) => (
              <ListItem key={`user-ui-search-list-item-${index}`} disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (!!setUser) setUser(item)
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={item.profilePictureUrl} />
                  </ListItemAvatar>
                  {/* <ListItemText primary={`${item.displayName} • ${item.cUsername}`} secondary={item.bio} /> */}
                  <ListItemText primary={item.displayName} secondary={item.bio} />
                </ListItemButton>
              </ListItem>
            ))}
            {users.data.length === 0 ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <QuestionMarkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Opps!' secondary={`No creator goes by '${searchValue}'`} />
              </ListItem>
            ) : null}
          </List>
        ) : (
          <DialogContentText>Type to search any user!</DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  )
}
