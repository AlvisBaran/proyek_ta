'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { Box, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import MessageIcon from '@mui/icons-material/Message'

import MyAxios from '@/hooks/MyAxios'

const createRoomDefaultValues = { loading: false, error: false, success: false }

export default function MoreActionMenu({ creatorId }) {
  const router = useRouter()
  const [createRoom, setCreateRoom] = useState(createRoomDefaultValues)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // * On Close
  function handleClose() {
    setAnchorEl(null)
  }

  // * Create New Room
  async function createNewRoom() {
    setCreateRoom({ ...createRoom, loading: true, error: false, success: false })
    await MyAxios.post('/user/messaging', { user2Id: creatorId })
      .then(resp => {
        toast.success('Success create room!')
        setCreateRoom({ ...createRoom, loading: false, success: true })
        router.push('/message')
        handleClose()
      })
      .catch(err => {
        console.error(err)
        if (err.response.data.code === 'ROOM_ALREADY_EXISTS') {
          toast.success('Room is already created!')
          setCreateRoom({ ...createRoom, loading: false, success: true })
          router.push('/message')
          handleClose()
        } else {
          toast.error(`Failed create room!\n${err.response.data.message}`)
          setCreateRoom({ ...createRoom, loading: false, error: true })
        }
      })
  }

  return (
    <Box>
      <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id='content-more-action-menu'
        aria-labelledby='content-more-action-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={createNewRoom} disabled={createRoom.loading}>
          <ListItemIcon>
            <MessageIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>{createRoom.loading ? 'Creating room...' : 'Message Creator'}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
