import { Box, Container, Stack } from '@mui/material'

import CreatorPageTabs from '../_components/CreatorPageTabs'
import PopularContentsSection from './_components/PopularContentsSection'
import LatestContentsSection from './_components/LatestContentsSection'

export default function CreatorHomePage({ params }) {
  const { cUsername } = params

  return (
    <Box>
      <CreatorPageTabs cUsername={cUsername} value='home' />
      <Container maxWidth='md' sx={{ py: 4, pb: 8 }}>
        <Stack gap={4}>
          <PopularContentsSection cUsername={cUsername} />
          <LatestContentsSection cUsername={cUsername} />
        </Stack>
      </Container>
    </Box>
  )
}
