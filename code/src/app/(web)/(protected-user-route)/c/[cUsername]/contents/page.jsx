'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Box, Container, Grid, Pagination, Skeleton, Stack } from '@mui/material'

import CreatorPageTabs from '../_components/CreatorPageTabs'
import ContentCard from '@/app/(web)/_components/content-ui/ContentCard'

import MyAxios from '@/hooks/MyAxios'
import { range } from '@/utils/mathHelper'
import toast from 'react-hot-toast'

const contentsDefaultValues = {
  data: [],
  loading: false,
  success: false,
  error: false,
  perPage: 1,
  total: 1,
  totalPage: 1
}

export default function CreatorContentsPage({ params }) {
  const { cUsername } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchPage = searchParams.get('page') ?? null
  const page = !!searchPage && !isNaN(Number(searchPage)) ? Number(searchPage) : 1

  const [contents, setContents] = useState(contentsDefaultValues)

  // ** Fetch Data
  async function fetchContents() {
    setContents({ ...contents, loading: true, success: false, error: false })
    await MyAxios.get(`/feeds/creator/${cUsername}/content`, {
      params: {
        page,
        perPage: 6
      }
    })
      .then(resp => {
        setContents({
          ...contents,
          data: resp.data.rows,
          loading: false,
          success: true,
          perPage: resp.data.perPage,
          total: resp.data.total,
          totalPage: resp.data.totalPage
        })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to load contents!\n${err.response.data.messsage}`)
        setContents({ ...contents, data: [], loading: false, error: true })
      })
  }

  // * Fetch data on load
  useEffect(() => {
    if (!!cUsername) fetchContents()
  }, [cUsername, page])

  function PaginationComponent({ position }) {
    return (
      <Stack
        direction='row'
        justifyContent='end'
        sx={{ pt: position === 'top' ? 0 : 2, pb: position === 'bottom' ? 0 : 2 }}
      >
        <Pagination
          count={contents.totalPage}
          variant='outlined'
          shape='rounded'
          page={page}
          onChange={(e, value) => router.replace(`/c/${cUsername}/contents?page=${value}`)}
        />
      </Stack>
    )
  }

  return (
    <Box>
      <CreatorPageTabs cUsername={cUsername} value='contents' />
      <Container maxWidth='md' sx={{ py: 4, pb: 8 }}>
        <PaginationComponent position='top' />
        {contents.loading ? (
          <Grid container spacing={2}>
            {range({ max: 3 }).map((item, index) => (
              <Grid key={index} item xs={12} md={4}>
                <Skeleton variant='rectangular' height={260} />
              </Grid>
            ))}
          </Grid>
        ) : contents.success ? (
          <Grid container spacing={2}>
            {contents.data?.map((content, index) => (
              <Grid key={`c-${cUsername}-contents-item-${index}`} item xs={12} md={4}>
                <ContentCard content={content} relativeDate />
              </Grid>
            ))}
          </Grid>
        ) : null}
        <PaginationComponent position='bottom' />
      </Container>
    </Box>
  )
}
