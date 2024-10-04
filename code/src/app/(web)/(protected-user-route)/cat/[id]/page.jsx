'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

import { Container, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import UserPageLayout from '../../_components/layout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import { range } from '@/utils/mathHelper'
import ContentCardWithCreator from '@/app/(web)/_components/content-ui/ContentCardWithCreator'

const categoryDefaultValues = { data: null, loading: false, success: false, error: false }
const contentsDefaultValues = {
  data: [],
  loading: false,
  success: false,
  error: false,
  perPage: 1,
  total: 1,
  totalPage: 1
}

export default function UserCategoryDetailPage({ params }) {
  const id = params.id
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchPage = searchParams.get('page') ?? null
  const page = !!searchPage && !isNaN(Number(searchPage)) ? Number(searchPage) : 1
  const [category, setCategory] = useState(categoryDefaultValues)
  const [contents, setContents] = useState(contentsDefaultValues)
  console.log(contents.data)
  // * Fetch Category
  async function fetchCategory() {
    setCategory({ ...category, loading: true, error: false, success: false })
    await MyAxios.get(`/category/${id}`)
      .then(resp => {
        setCategory({ ...category, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCategory({ ...category, data: null, loading: false, error: true })
        toast.error(`Failed to load category!\n${err.response.data.message}`)
        router.back()
      })
  }

  // ** Fetch Contents
  async function fetchContents() {
    setContents({ ...contents, loading: true, success: false, error: false })
    await MyAxios.get(`/category/${id}/contents`, {
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

  // * On Load
  useEffect(() => {
    if (!!id) fetchCategory()
  }, [id])

  // * On Category Exists
  useEffect(() => {
    if (!category.loading && category.success) fetchContents()
  }, [category.loading])

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
    <UserPageLayout appbarTitle='Category'>
      {category.loading ? (
        <LoadingSpinner />
      ) : category.success && !!category.data ? (
        <Container maxWidth='md'>
          <Typography variant='h6'>Contents categorized by "{category.data.label}"</Typography>
          <PaginationComponent position='top' />
          {contents.loading ? (
            <Grid container spacing={2}>
              {range({ max: 3 }).map((item, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Skeleton variant='rectangular' height={300} />
                </Grid>
              ))}
            </Grid>
          ) : contents.success ? (
            <Grid container spacing={2}>
              {contents.data?.map((content, index) => (
                <Grid key={`cat-${id}-contents-item-${index}`} item xs={12} md={4}>
                  <ContentCardWithCreator content={content} relativeDate />
                </Grid>
              ))}
            </Grid>
          ) : null}
          <PaginationComponent position='bottom' />
        </Container>
      ) : null}
    </UserPageLayout>
  )
}
