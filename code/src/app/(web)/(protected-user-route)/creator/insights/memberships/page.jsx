'use client'

import CreatorPageLayout from '../../_components/layout'
import CreatorInsightTabs from '../_components/CreatorInsightTabs'

export default function CreatorInsightsMembershipsPage() {
  return (
    <CreatorPageLayout appbarTitle='Insights'>
      <CreatorInsightTabs value='memberships' />
    </CreatorPageLayout>
  )
}
