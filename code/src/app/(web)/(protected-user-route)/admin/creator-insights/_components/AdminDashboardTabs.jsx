'use client'

import Link from 'next/link'

import { Button, Stack } from '@mui/material'

const tabs = [
  { value: 'memberships', label: 'Memberships' },
  { value: 'earnings', label: 'Earnings' },
  { value: 'views', label: 'Views' },
  { value: 'regional-views', label: 'Regional Views' }
]

export default function AdminDashboardTabs({ value, action }) {
  return (
    <Stack direction='row' gap={2} flexWrap='wrap' alignItems='center'>
      <Stack direction='row' gap={1.5} flexWrap='wrap' sx={{ flexGrow: 1 }}>
        {tabs.map(tab => (
          <Button
            key={`admin-dashboard-tab-${tab.value}`}
            LinkComponent={Link}
            href={`/admin/creator-insights/${tab.value}`}
            variant={tab.value === value ? 'contained' : 'outlined'}
            size='large'
          >
            {tab.label}
          </Button>
        ))}
      </Stack>
      {action}
    </Stack>
  )
}
