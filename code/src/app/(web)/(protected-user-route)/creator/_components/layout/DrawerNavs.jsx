'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'

import SourceIcon from '@mui/icons-material/Source'
import PeopleIcon from '@mui/icons-material/People'
import InsightsIcon from '@mui/icons-material/Insights'
import RestorePageIcon from '@mui/icons-material/RestorePage'
import MessageIcon from '@mui/icons-material/Message'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import HomeIcon from '@mui/icons-material/Home'
import WalletIcon from '@mui/icons-material/Wallet'

import Logo from '@/app/(web)/_components/Logo'
import CreatorPageLayoutDrawerNavsUserInterfaces from './DrawerNavsUserInterfaces'

const navs = [
  {
    href: '/creator',
    label: 'Insights',
    icon: <InsightsIcon />
  },
  {
    href: '/creator/master-content',
    label: 'Master Content',
    icon: <SourceIcon />
  },
  {
    href: '/creator/membership',
    label: 'Master Membership',
    icon: <PeopleIcon />
  },
  {
    href: '/creator/request-content',
    label: 'Content Request',
    icon: <RestorePageIcon />
  },
  {
    href: '/creator/message',
    label: 'Message',
    icon: <MessageIcon />
  },
  {
    href: '/creator/membership-transactions',
    label: 'Membership Transactions',
    icon: <AccountBalanceWalletIcon />
  },
  {
    href: '/creator/content-request-transactions',
    label: 'Content Request Transactions',
    icon: <WalletIcon />
  },
  {
    href: '/creator/withdraw',
    label: 'Withdraw',
    icon: <AccountBalanceIcon />
  },
  // {
  //   href: '/creator/notification',
  //   label: 'Notifikasi',
  //   icon: <NotificationsIcon />
  // },
  {
    href: '/home',
    label: 'User Home',
    icon: <HomeIcon />
  }
]

export const dynamic = 'force-dynamic'

export default function CreatorPageLayoutDrawerNavs() {
  const pathName = usePathname()

  const isSelected = href => {
    const pathSplitted = pathName.split('/')
    const hrefSplitted = href.split('/')
    return `/${pathSplitted[1]}/${pathSplitted[2]}` === `/${hrefSplitted[1]}/${hrefSplitted[2]}`
  }

  const currNavs = navs

  return (
    <Stack justifyContent='space-between' sx={{ height: '100%' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemAvatar>
              <Logo fontSize='large' />
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
      <CreatorPageLayoutDrawerNavsUserInterfaces />
    </Stack>
  )
}

export const ADMIN_NAVS = navs
