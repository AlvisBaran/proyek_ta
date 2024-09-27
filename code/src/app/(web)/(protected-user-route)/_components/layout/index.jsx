'use client'

import { useState } from 'react'

import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import UserPageLayoutDrawerNavs from './DrawerNavs'

const drawerWidth = 280

export default function UserPageLayout({ children, appbarTitle = 'Panthreon', contentPadding = 2 }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' }
        }}
        color='default'
        elevation={0}
      >
        <Toolbar>
          <IconButton color='inherit' aria-label='open drawer' edge='start' onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' textAlign='center' width='100%' component='div'>
            {appbarTitle}
          </Typography>
          <IconButton edge='end' sx={{ ml: 2, visibility: 'hidden' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component='nav' sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          <UserPageLayoutDrawerNavs />
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          <UserPageLayoutDrawerNavs />
        </Drawer>
      </Box>
      <Box component='main' sx={{ flexGrow: 1, p: contentPadding, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar sx={{ display: { sm: 'none' } }} />
        {children}
      </Box>
    </Box>
  )
}
