import { redirect } from 'next/navigation'

import CreatorPageTabs from './_components/CreatorPageTabs'

export default function CreatorPage({ params }) {
  const { cUsername } = params

  return redirect(`/c/${cUsername}/home`)
  return (
    <Box>
      <CreatorPageTabs cUsername={cUsername} />
    </Box>
  )
}
