'use client'

import Link from 'next/link'

import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'

const tabs = [
  { label: 'Home', value: 'home' },
  { label: 'Contents', value: 'contents' },
  { label: 'Membership', value: 'membership' },
  { label: 'About', value: 'about' }
]

export default function CreatorPageTabs({ value, cUsername }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        centered={upMd}
        variant={upMd ? undefined : 'scrollable'}
        scrollButtons={upMd ? undefined : 'auto'}
        sx={{ maxWidth: '100vw' }}
      >
        {tabs.map(tab => (
          <Tab
            key={`c-${cUsername}-page-tab-${tab.value}`}
            label={tab.label}
            value={tab.value}
            LinkComponent={Link}
            href={`/c/${cUsername}/${tab.value}`}
          />
        ))}
      </Tabs>
    </Box>
  )
}
