'use client'

import Link from 'next/link'

import { Box, Button, Card, Container, Grid, Stack, useMediaQuery, useTheme } from '@mui/material'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import ShopIcon from '@mui/icons-material/Shop'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AddCardIcon from '@mui/icons-material/AddCard'

import PageHeader from '@/app/(web)/_components/PageHeader'

const accountLayoutNavs = [
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
  }
]

export default function AccountLayout({ children, activeNav }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  const currNav = accountLayoutNavs.find(item => item.value === activeNav)

  return (
    <Container maxWidth='md' sx={{ mx: 'auto' }}>
      <Card elevation={3} sx={{ p: 2, mb: 12 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box>
              <Stack>
                {accountLayoutNavs.map((nav, index) => (
                  <Button
                    key={`accountLayoutNavs-item-${index}`}
                    LinkComponent={Link}
                    href={`/account/${nav.value}`}
                    fullWidth
                    size='large'
                    startIcon={upMd ? undefined : nav.icon}
                    endIcon={upMd ? nav.icon : undefined}
                    variant={nav.value === activeNav ? 'contained' : 'text'}
                    sx={{ my: nav.value === activeNav ? 1 : 0, justifyContent: upMd ? 'end' : 'start' }}
                  >
                    {nav.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <PageHeader title={currNav.label} subTitle={currNav.subTitle} action={currNav.action} />
            {/* <Divider sx={{ mt: 1 }} /> */}
            <Box>{children}</Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  )
}
