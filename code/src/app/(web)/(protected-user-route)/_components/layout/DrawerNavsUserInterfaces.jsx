'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
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

export default function UserPageLayoutDrawerNavsUserInterfaces() {
  const session = useSession()
  const user = getUserFromComposedSession(session.data)

  const [userActionAnchorEl, setUserActionAnchorEl] = useState(null)

  if (!!user)
    return (
      <Box>
        {user.role === 'normal' ? (
          <Box p={1}>
            <Card elevation={3}>
              <CardHeader
                sx={{ pb: 0, pt: 1 }}
                title='Want to be a creator?'
                titleTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              />
              <CardActions>
                <Button
                  size='small'
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  LinkComponent={Link}
                  href='/account-upgrade'
                >
                  Register now!
                </Button>
              </CardActions>
            </Card>
          </Box>
        ) : null}

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
            <ListItemText primary={user.displayName} secondary={user.role === 'normal' ? 'member' : user.role} />
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
