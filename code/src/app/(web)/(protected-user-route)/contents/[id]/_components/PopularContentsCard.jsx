'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, Stack, Typography } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const contentsDefaultValues = { data: [], loading: false, success: false, error: false }

export default function PopularContentsCard({ contentId, creator }) {
  const [contents, setContents] = useState(contentsDefaultValues)

  // * Fetch Data
  async function fetchContents() {
    setContents({ ...contents, loading: true, success: false, error: false })
    await MyAxios.get(`/feeds/creator/${creator.cUsername}/content/popular`, {
      params: {
        exclude: [contentId],
        perPage: 6
      }
    })
      .then(resp => {
        setContents({
          ...contents,
          data: resp.data.rows,
          loading: false,
          success: true
        })
      })
      .catch(err => {
        setContents({ ...contents, data: [], loading: false, error: true })
      })
  }

  // * Fetch data on load
  useEffect(() => {
    if (!!creator && !!creator.cUsername) fetchContents()
  }, [creator])

  return (
    <Card elevation={3}>
      <CardHeader title='Popular Contents' subheader={`by ${creator.displayName}`} />
      <CardContent sx={{ py: 0, px: 1 }}>
        {contents.loading ? (
          <LoadingSpinner />
        ) : contents.success ? (
          <Stack gap={1}>
            {contents.data.map((content, index) => (
              <Card key={`content-detail-popular-contents-card-item-${index}`} sx={{ bgcolor: 'white' }}>
                <CardActionArea LinkComponent={Link} href={`/contents/${content.id}`}>
                  <Grid container>
                    <Grid item xs={3} md={4}>
                      <CardMedia
                        component={content.Gallery[0]?.type === 'video' ? 'video' : 'img'}
                        loading='lazy'
                        src={content.Gallery[0]?.url}
                        title={content.Gallery[0]?.name}
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={9} md={8}>
                      <CardContent>
                        <Typography fontWeight={600}>{content.title}</Typography>
                        <Typography variant='body2'>{dayjs(content.publishedAt).fromNow()}</Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        ) : null}
      </CardContent>
    </Card>
  )
}
