'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { Fragment, useEffect, useState } from 'react'

import { Button, Container, Skeleton, Stack, Typography } from '@mui/material'

import CategoryIcon from '@mui/icons-material/Category'

import MyAxios from '@/hooks/MyAxios'
import { range } from '@/utils/mathHelper'

const categoriesDefaultValues = { data: [], loading: false, error: false, success: false }

export default function PopularCategorySection() {
  const [categories, setCategories] = useState(categoriesDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setCategories({ ...categories, loading: true, success: false, error: false })
    await MyAxios.get('/category/popular')
      .then(resp => {
        setCategories({ ...categories, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to load popular category!\n${err.response.data.message}`)
        setCategories({ ...categories, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container maxWidth='lg'>
      <Stack direction='row' alignItems='center' gap={1} sx={{ color: 'GrayText' }}>
        <CategoryIcon />
        <Typography variant='h6'>Popular Categories</Typography>
      </Stack>
      <Stack
        direction='row'
        alignItems='center'
        gap={1}
        sx={{
          py: 1,
          overflowX: 'auto',
          maxWidth: '100%'
          // '::-webkit-scrollbar': { display: 'none' },
          // msOverflowStyle: 'none',
          // scrollbarWidth: 'none'
        }}
      >
        {categories.loading ? (
          <Fragment>
            {range({ max: 6 }).map(item => (
              <Skeleton key={item} variant='rectangular' width={160} height={36} />
            ))}
          </Fragment>
        ) : categories.success ? (
          <Fragment>
            {categories.data.map((category, index) => (
              <Button
                key={`home-popular-category-item-${index}`}
                variant='outlined'
                LinkComponent={Link}
                href={`/cat/${category.id}`}
                sx={{ borderRadius: 0.3, minWidth: 160, px: 2 }}
              >
                {category.label}
              </Button>
            ))}
          </Fragment>
        ) : null}
      </Stack>
    </Container>
  )
}
