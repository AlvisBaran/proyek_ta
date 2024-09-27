'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'

import PinterestIcon from '@mui/icons-material/Pinterest'
import HomeIcon from '@mui/icons-material/Home'
import MessageIcon from '@mui/icons-material/Message'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CreateIcon from '@mui/icons-material/Create'

import UserPageLayoutDrawerNavsUserInterfaces from './DrawerNavsUserInterfaces'

import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

const navs = [
  { label: 'Home', icon: <HomeIcon />, href: '/home' },
  { label: 'Message', icon: <MessageIcon />, href: '/message' },
  { label: 'Account', icon: <AccountCircleIcon />, href: '/account' },
  { label: 'Request Content', icon: <BusinessCenterIcon />, href: '/request-content' }
  // { label: "Notifications", icon: null, href: "/notifications" },
]

export const dynamic = 'force-dynamic'

export default function UserPageLayoutDrawerNavs() {
  const pathName = usePathname()
  const session = useSession()
  const user = getUserFromComposedSession(session.data)

  const isSelected = href => {
    const pathSplitted = pathName.split('/')
    return '/' + pathSplitted[1] === href
  }

  const currNavs =
    user?.role === 'admin'
      ? [
          ...navs,
          {
            label: 'Admin Page',
            href: '/admin',
            icon: <AdminPanelSettingsIcon />
          }
        ]
      : user?.role === 'creator'
        ? [
            ...navs,
            {
              label: 'Creator Page',
              href: '/creator',
              icon: <CreateIcon />
            }
          ]
        : navs

  return (
    <Stack justifyContent='space-between' sx={{ height: '100%' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemAvatar>
              <PinterestIcon fontSize='large' />
            </ListItemAvatar>
          </ListItemButton>
        </ListItem>
        {currNavs.map((nav, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton LinkComponent={Link} href={nav.href} selected={isSelected(nav.href)}>
              <ListItemIcon>{nav.icon}</ListItemIcon>
              <ListItemText primary={nav.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <UserPageLayoutDrawerNavsUserInterfaces />
    </Stack>
  )
}

export const USER_NAVS = navs
