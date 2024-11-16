'use client'

import Link from 'next/link'

import { Box, Button, Card, Container, Grid, Stack, useMediaQuery, useTheme } from '@mui/material'

import PageHeader from '@/app/(web)/_components/PageHeader'
import { accountLayoutNavs } from './navs'

export default function AccountLayout({ children, activeNav }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  const currNav = accountLayoutNavs.find(item => item.value === activeNav)

  return (
    <Container maxWidth='md' sx={{ mx: 'auto' }}>
      <Card elevation={3} sx={{ p: 2, mb: 12 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3.5}>
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
                    sx={{
                      my: nav.value === activeNav ? 1 : 0,
                      justifyContent: upMd ? 'end' : 'start',
                      textAlign: upMd ? 'end' : 'start'
                    }}
                  >
                    {nav.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <PageHeader title={currNav.label} subTitle={currNav.subTitle} action={currNav.action} />
            {/* <Divider sx={{ mt: 1 }} /> */}
            <Box>{children}</Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  )
}
