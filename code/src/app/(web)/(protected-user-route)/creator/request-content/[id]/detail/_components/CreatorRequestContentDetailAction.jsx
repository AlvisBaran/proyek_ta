'use client'

import { Fragment, useState } from 'react'

import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const SET_CONTENT_ALLOWED_STATUS = ['on-progress', 'waiting-requestor-confirmation']

export default function CreatorRequestContentDetailAction({ data, setOpenSetContentDialog }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => setAnchorEl(null)

  const menus = [
    // { show: data.status === 'requested', label: 'Set to "On Progress"', icon: null, onClick: undefined },
    // {
    //   show: data.status === 'waiting-creator-confirmation',
    //   label: 'Set to "Payment Confirmation"',
    //   icon: null,
    //   onClick: undefined
    // },
    {
      show: SET_CONTENT_ALLOWED_STATUS.includes(data.status),
      label: !!data.Content ? 'Re-set Content' : 'Set Content',
      icon: <CheckCircleIcon fontSize='small' />,
      onClick: () => setOpenSetContentDialog(true)
    }
  ]

  if (menus.filter(item => item.show === true).length > 0)
    return (
      <Fragment>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id='creator-request-content-detail-action'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
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
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {menus.map((menu, index) =>
            menu.show ? (
              <MenuItem key={`creator-request-content-action-menu-item-${index}`} onClick={menu.onClick}>
                {!!menu.icon ? <ListItemIcon>{menu.icon}</ListItemIcon> : null}
                {menu.label}
              </MenuItem>
            ) : null
          )}
        </Menu>
      </Fragment>
    )

  return null
}
