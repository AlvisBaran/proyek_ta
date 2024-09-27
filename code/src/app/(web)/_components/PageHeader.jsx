'use client'

import { Box, Stack, Typography } from '@mui/material'

export default function PageHeader({ title, subTitle, action, sx }) {
  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={4}
      flexWrap='wrap'
      sx={{ ...sx }}
    >
      <Box>
        <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant='body2' component='p'>
          {subTitle}
        </Typography>
      </Box>
      {action ?? null}
    </Stack>
  )
}
