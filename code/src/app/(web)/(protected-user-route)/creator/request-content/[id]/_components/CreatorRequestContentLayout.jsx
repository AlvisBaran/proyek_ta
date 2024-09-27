'use client'

import Link from 'next/link'

import { Box, Tab, Tabs } from '@mui/material'

import CreatorPageLayout from '../../../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

export const creatorRequestContentNavs = [
  { label: 'Detail', value: 'detail', icon: null, subTitle: 'Request details informations' },
  { label: 'Members', value: 'members', icon: null, subTitle: 'Requestor members' },
  { label: 'Payments', value: 'payments', icon: null, subTitle: 'Requestor and members payments log' }
  // ,{ label: "", value: '', icon: null, subTitle: "" },
]

export default function CreatorRequestContentLayout({ children, activeNav, id }) {
  const currNav = creatorRequestContentNavs.find(item => item.value === activeNav)

  return (
    <CreatorPageLayout appbarTitle={`Content Request - ${currNav.label}`}>
      <Breadcrumb
        data={[
          {
            title: 'Content Request',
            url: '/creator/request-content'
          },
          {
            title: currNav.label,
            url: `/creator/request-content/${id}`
          }
        ]}
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={activeNav} scrollButtons='auto' variant='scrollable' allowScrollButtonsMobile role='navigation'>
          {creatorRequestContentNavs.map((nav, index) => (
            <Tab
              key={`creator-request-content-detail-tab-${index}`}
              LinkComponent={Link}
              href={`/creator/request-content/${id}/${nav.value}`}
              value={nav.value}
              label={nav.label}
              icon={nav.icon}
              iconPosition='start'
            />
          ))}
        </Tabs>
      </Box>
      {children}
    </CreatorPageLayout>
  )
}
