import { Box, Stack } from '@mui/material'

import UserPageLayout from '../_components/layout'
import CreatorAndCategorySearchBox from '../_components/ui/CreatorAndCategorySearchBox'
import PopularCategorySection from './_components/PopularCategorySection'
import FollowedCreatorSection from './_components/FollowedCreatorSection'
import ContentFeedsSection from './_components/ContentFeedsSection'

export default function UserHomePage() {
  return (
    <UserPageLayout appbarTitle='Home'>
      <Stack gap={2}>
        <CreatorAndCategorySearchBox />
        <Box />
        <PopularCategorySection />
        <FollowedCreatorSection />
        <ContentFeedsSection />
      </Stack>
    </UserPageLayout>
  )
}
