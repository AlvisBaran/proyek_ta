'use client'

import { useEffect, useState } from 'react'

import { Box, Container, Paper, Typography } from '@mui/material'

import CreatorPageTabs from '../_components/CreatorPageTabs'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import MyAxios from '@/hooks/MyAxios'

const creatorDefaultValues = { data: null, loading: false, error: false, success: false }

export default function CreatorAboutPage({ params }) {
  const { cUsername } = params
  const [creator, setCreator] = useState(creatorDefaultValues)

  // * Fetch Creator
  async function fetchCreator() {
    setCreator({ ...creator, loading: true, error: false, success: false })
    await MyAxios.get(`/feeds/creator/${cUsername}`)
      .then(resp => {
        setCreator({ ...creator, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCreator({ ...creator, data: null, loading: false, error: true })
      })
  }

  // * Fetch on load
  useEffect(() => {
    if (!!cUsername) fetchCreator()
  }, [cUsername])

  return (
    <Box>
      <CreatorPageTabs cUsername={cUsername} value='about' />
      {creator.loading ? (
        <LoadingSpinner />
      ) : creator.success && !!creator.data ? (
        <Container maxWidth='sm' sx={{ mx: 'auto', mb: 12 }}>
          <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
            {!!creator.data.about ? (
              <Box dangerouslySetInnerHTML={{ __html: creator.data.about }} />
            ) : (
              <Typography>Oops! There is no about me yet :(</Typography>
            )}
          </Paper>
        </Container>
      ) : null}
    </Box>
  )
}
