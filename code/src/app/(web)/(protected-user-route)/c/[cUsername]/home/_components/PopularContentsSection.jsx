'use client'

import { useEffect, useState } from 'react'

import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import ContentCard from '@/app/(web)/_components/content-ui/ContentCard'
import { range } from '@/utils/mathHelper'

const contentsDefaultValues = { data: [], loading: false, success: false, error: false }

export default function PopularContentsSection({ cUsername }) {
  const [contents, setContents] = useState(contentsDefaultValues)

  // * Fetch Data
  async function fetchContets() {
    setContents({ ...contents, loading: true, success: false, error: false })
    await MyAxios.get(`/feeds/creator/${cUsername}/content/popular`, {
      params: {
        perPage: 3
      }
    })
      .then(resp => {
        setContents({ ...contents, data: resp.data.rows, loading: false, success: true })
      })
      .catch(err => {
        setContents({ ...contents, data: [], loading: false, error: true })
      })
  }

  // * Fetch data on load
  useEffect(() => {
    if (!!cUsername) fetchContets()
  }, [cUsername])

  if (contents.loading)
    return (
      <Box>
        <Skeleton variant='rectangular' width={120} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {range({ max: 3 }).map((item, index) => (
            <Grid key={index} item xs={12} md={4}>
              <Skeleton variant='rectangular' height={260} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  else if (contents.success && contents.data.length > 0)
    return (
      <Box>
        <Stack direction='row' justifyContent='space-between' alignItems='start' pb={2}>
          <Typography variant='h5'>Popular Contents</Typography>
        </Stack>
        <Grid container spacing={2}>
          {contents.data?.map((content, index) => (
            <Grid key={index} item xs={12} md={4}>
              <ContentCard content={content} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  else return null
}
