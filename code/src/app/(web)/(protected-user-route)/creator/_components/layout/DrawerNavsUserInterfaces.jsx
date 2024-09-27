'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'

import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

export const dynamic = 'force-dynamic'

export default function CreatorPageLayoutDrawerNavsUserInterfaces() {
  const session = useSession()
  const user = getUserFromComposedSession(session.data)

  const [userActionAnchorEl, setUserActionAnchorEl] = useState(null)

  if (!!user)
    return (
      <Box>
        <List>
          <Divider />
          <ListItem
            secondaryAction={
              <IconButton onClick={e => setUserActionAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={user.profilePicture} />
            </ListItemAvatar>
            <ListItemText primary={user.displayName} secondary={user.role} />
          </ListItem>
        </List>

        <UserActionPopup anchorEl={userActionAnchorEl} handleClose={() => setUserActionAnchorEl(null)} />
      </Box>
    )

  return null
}

function UserActionPopup({ anchorEl, handleClose }) {
  const open = Boolean(anchorEl)

  return (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mb: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: -10,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem
        onClick={() => {
          handleClose()
          signOut()
        }}
      >
        <ListItemIcon>
          <LogoutIcon color='error' fontSize='small' />
        </ListItemIcon>
        <Typography color='error.main'>Logout</Typography>
      </MenuItem>
    </Menu>
  )
}
