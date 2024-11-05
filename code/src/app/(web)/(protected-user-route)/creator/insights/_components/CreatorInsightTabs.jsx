'use client'

import Link from 'next/link'

import { Button, Stack } from '@mui/material'

const tabs = [
  { value: 'memberships', label: 'Memberships' },
  { value: 'earnings', label: 'Earnings' },
  { value: 'views', label: 'Views' },
  { value: 'regional-views', label: 'Regional Views' }
]

export default function CreatorInsightTabs({ value }) {
  return (
    <Stack direction='row' gap={1.5}>
      {tabs.map(tab => (
        <Button
          key={`creator-insights-tab-${tab.value}`}
          LinkComponent={Link}
          href={`/creator/insights/${tab.value}`}
          variant={tab.value === value ? 'contained' : 'outlined'}
          size='large'
        >
          {tab.label}
        </Button>
      ))}
    </Stack>
  )
}
