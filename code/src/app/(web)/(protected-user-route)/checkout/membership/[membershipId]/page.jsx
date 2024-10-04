'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import PaymentIcon from '@mui/icons-material/Payment'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

import MyAxios from '@/hooks/MyAxios'
import Logo from '@/app/(web)/_components/Logo'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const membershipDefaultValues = { data: null, loading: false, success: false, error: false }
const buyMembershipDefaultValues = { loading: false, success: false, error: false }

export default function CheckoutMembershipPage({ params }) {
  const membershipId = params.membershipId ?? null
  const router = useRouter()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [membership, setMembership] = useState(membershipDefaultValues)
  const [buyMembership, setbuyMembership] = useState(buyMembershipDefaultValues)

  // * Fetch Data
  async function fetchMembership() {
    setMembership({ ...membership, loading: true, error: false, success: false })
    await MyAxios.get(`/user/membership/${membershipId}`)
      .then(resp => {
        setMembership({ ...membership, data: resp.data, loading: false, success: true })
      })
      .catch(error => {
        console.error(error)
        setMembership({ ...membership, data: null, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!membershipId) fetchMembership()
  }, [membershipId])

  // * Buy Membership
  async function buyMembershipRequest() {
    setbuyMembership({ ...buyMembership, loading: true, success: false, error: false })
    await MyAxios.post('/user/transaction/buy-membership', { membershipId })
      .then(resp => {
        toast.success('Success buy membership!')
        setbuyMembership({ ...buyMembership, loading: false, success: true })
        router.replace('/account/memberships')
      })
      .catch(err => {
        console.error(err)
        setbuyMembership({ ...buyMembership, loading: false, error: true })
        toast.error(`Error buy membership!\n ${err.response.data.message}`)
      })
  }

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ minHeight: '100vh' }}>
          <Box sx={{ width: '100%', p: upMd ? 2 : 1 }}>
            <Link href={'/home'}>
              <Logo fontSize='large' />
            </Link>
          </Box>
          {membership.loading ? (
            <LoadingSpinner />
          ) : membership.success && !!membership.data ? (
            <Box>
              <Container maxWidth='xs'>
                <Typography variant='h4' mb={4}>
                  Payment details
                </Typography>
                <Typography variant='h5'>Order summary</Typography>
                <List sx={{ mb: 4 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={membership.data?.User?.profilePictureUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={membership.data?.User?.displayName} secondary={membership.data.name} />
                  </ListItem>
                  <Divider />
                  <ListItem
                    secondaryAction={
                      <Typography fontWeight={600}>Rp {intlNumberFormat(membership.data.price)}</Typography>
                    }
                  >
                    <ListItemText primary='Total due' primaryTypographyProps={{ variant: 'h6' }} />
                  </ListItem>
                  <Divider />
                </List>

                <Typography variant='caption'>
                  By clicking Pay now, you agree to Panthreon's Terms of Use and Privacy Policy.
                </Typography>

                <Button
                  fullWidth
                  variant='contained'
                  startIcon={<AttachMoneyIcon />}
                  onClick={buyMembershipRequest}
                  sx={{ mt: 2 }}
                  disabled={buyMembership.loading || membership.loading}
                >
                  {buyMembership.loading ? 'Loading...' : 'Pay now'}
                </Button>
              </Container>
            </Box>
          ) : null}
        </Grid>
        <Grid item xs={12} md={6} sx={{ bgcolor: upMd ? theme.palette.primary.contrastText : undefined }}>
          <Stack alignItems='center' justifyContent='center' height='100%'>
            <Typography variant='h4' textAlign='center'>
              <Logo fontSize='large' />
              ANTHREON CHECKOUT
            </Typography>
            <Typography variant='h5' textAlign='center'>
              MEMBERSHIP
            </Typography>
            <Stack direction='row' gap={1} mt={2}>
              <PaymentIcon />
              <MonetizationOnIcon />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
