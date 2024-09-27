'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'

import PinterestIcon from '@mui/icons-material/Pinterest'
import PeopleIcon from '@mui/icons-material/People'
import InsightsIcon from '@mui/icons-material/Insights'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import CategoryIcon from '@mui/icons-material/Category'
import HomeIcon from '@mui/icons-material/Home'
import AddCardIcon from '@mui/icons-material/AddCard'
import WalletIcon from '@mui/icons-material/Wallet'
// import RedeemIcon from '@mui/icons-material/Redeem'

import AdminPageLayoutDrawerNavsUserInterfaces from './DrawerNavsUserInterfaces'

const navs = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: <InsightsIcon />
  },
  {
    href: '/admin/master-user',
    label: 'Master User',
    icon: <PeopleIcon />
  },
  {
    href: '/admin/master-category',
    label: 'Master Category',
    icon: <CategoryIcon />
  },
  {
    href: '/admin/topup-history',
    label: 'Top Up History',
    icon: <AddCardIcon />
  },
  {
    href: '/admin/membership-transactions',
    label: 'Membership Transactions',
    icon: <AccountBalanceWalletIcon />
  },
  {
    href: '/admin/content-request-transactions',
    label: 'Content Request Transactions',
    icon: <WalletIcon />
  },
  {
    href: '/admin/request-creator-role',
    label: 'Request Creator Role',
    icon: <AssignmentIndIcon />
  },
  // {
  //   href: '/admin/request-refund',
  //   label: 'Request Refund',
  //   icon: <RedeemIcon />
  // },
  {
    href: '/admin/request-withdraw',
    label: 'Request Withdraw',
    icon: <RequestQuoteIcon />
  },
  // {
  //   href: '/admin/notification',
  //   label: 'Notifikasi',
  //   icon: <NotificationsIcon />
  // }
  {
    href: '/home',
    label: 'User Home',
    icon: <HomeIcon />
  }
]

export const dynamic = 'force-dynamic'

export default function AdminPageLayoutDrawerNavs() {
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
      <AdminPageLayoutDrawerNavsUserInterfaces />
    </Stack>
  )
}

export const ADMIN_NAVS = navs
