'use client'

import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Card,
  CardActionArea,
  CardHeader,
  Container,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import MyAxios from '@/hooks/MyAxios'
import { range } from '@/utils/mathHelper'
import ContentCard from '@/app/(web)/_components/content-ui/ContentCard'

const contentsDefaultValues = {
  data: [],
  loading: false,
  success: false,
  error: false,
  perPage: 1,
  total: 1,
  totalPage: 1
}

export default function ContentFeedsSection() {
  const [page, setPage] = useState(1)
  const [contents, setContents] = useState(contentsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setContents({ ...contents, loading: true, success: false, error: false })
    await MyAxios.get('/feeds')
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

  // * On Load
  useEffect(() => {
    fetchData()
  }, [page])

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
          onChange={(e, value) => setPage(value)}
        />
      </Stack>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Stack direction='row' alignItems='center' gap={1} mb={1} sx={{ color: 'GrayText' }}>
        <AutoAwesomeIcon />
        <Typography variant='h6'>Feeds</Typography>
      </Stack>
      <Grid container spacing={2}>
        {contents.loading ? (
          <Fragment>
            {range({ max: 3 }).map(item => (
              <Grid key={`home-content-feeds-skeleton-card-${item}`} item xs={12} md={4}>
                <Skeleton variant='rectangular' height={260} />
              </Grid>
            ))}
          </Fragment>
        ) : contents.success ? (
          <Fragment>
            {contents.data.map((content, index) => (
              <Grid key={`home-content-feeds-card-${index}`} item xs={12} md={4}>
                <ContentCard content={content} relativeDate equalHeight />
              </Grid>
            ))}
          </Fragment>
        ) : null}
      </Grid>
      <PaginationComponent position='bottom' />
    </Container>
  )
}
