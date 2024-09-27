'use client'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import HomeIcon from '@mui/icons-material/Home'

import { Box, Stack } from '@mui/material'

export default function Breadcrumb({ data, action }) {
  if (!!data && data.length > 0)
    return (
      <Box sx={{ marginBottom: 2 }}>
        <div role='presentation' sx={{ marginBottom: 4 }}>
          <Stack direction='row' gap={2} alignItems='center' flexWrap='wrap'>
            <Breadcrumbs aria-label='breadcrumb' sx={{ flexGrow: 1 }}>
              {data?.map((d, key) => (
                <Link
                  key={key}
                  underline='hover'
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color='inherit'
                  href={d.url}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize='inherit' />
                  {d.title}
                </Link>
              ))}
            </Breadcrumbs>
            {action}
          </Stack>
        </div>
      </Box>
    )
  return null
}
