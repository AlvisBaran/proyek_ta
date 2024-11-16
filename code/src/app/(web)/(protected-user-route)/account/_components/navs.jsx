import Link from 'next/link'
import { Button } from '@mui/material'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ShopIcon from '@mui/icons-material/Shop'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AddCardIcon from '@mui/icons-material/AddCard'
import LockResetIcon from '@mui/icons-material/LockReset'
import SummarizeIcon from '@mui/icons-material/Summarize'

export const accountLayoutNavs = [
  {
    label: 'Profile',
    value: 'profile',
    icon: <AccountCircleIcon />,
    subTitle: 'Set up your account profile',
    action: null
  },
  { label: 'Following', value: 'following', icon: <PeopleIcon />, subTitle: 'Creator you followed!', action: null },
  {
    label: 'Memberships',
    value: 'memberships',
    icon: <CardMembershipIcon />,
    subTitle: 'Your membership purchase history',
    action: null
  },
  {
    label: 'Top-up',
    value: 'top-up',
    icon: <ShopIcon />,
    subTitle: 'Your top-up history',
    action: (
      <Button variant='contained' size='small' startIcon={<AddCardIcon />} LinkComponent={Link} href='/checkout/top-up'>
        Top Up
      </Button>
    )
  },
  {
    label: 'Wallet History',
    value: 'wallet-history',
    icon: <ListAltIcon />,
    subTitle: 'Your full wallet history',
    action: null
  },
  {
    label: 'Change Password',
    value: 'change-password',
    icon: <LockResetIcon />,
    subTitle: 'Change your current password!',
    action: null
  },
  {
    label: 'Balance Summary',
    value: 'balance-summary',
    icon: <SummarizeIcon />,
    subTitle: 'Your account balance summary!',
    action: null
  }
]
