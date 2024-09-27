import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export default function MembershipCard({ membership }) {
  if (!!membership)
    return (
      <Card elevation={3} sx={{ height: '100%' }}>
        {!!membership.banner && !!membership.bannerUrl ? (
          <CardMedia component='img' src={membership.bannerUrl} height={160} />
        ) : null}
        <CardHeader
          title={membership.name}
          subheader={
            <Stack direction='row' alignItems='center' gap={1}>
              <Typography variant='h6'>{`Rp ${intlNumberFormat(membership.price)}`}</Typography>
              <Typography variant='body2'>{`/ ${intlNumberFormat(membership.interval)} day(s)`}</Typography>
            </Stack>
          }
        />
        <CardActions>
          <Button
            variant='contained'
            size='large'
            fullWidth
            LinkComponent={Link}
            href={`/checkout/membership/${membership.id}`}
          >
            Join
          </Button>
        </CardActions>
        <CardContent>
          <Typography>{membership.description}</Typography>
        </CardContent>
      </Card>
    )

  return null
}
