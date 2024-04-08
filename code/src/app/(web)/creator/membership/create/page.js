'use client'

import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import MyAxios from '@/hooks/MyAxios'
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const router = useRouter()

  const dataBreadcrumb = [
    {
      title: 'Master Membership',
      url: '/creator/membership'
    },
    {
      title: 'Create Membership',
      url: '/creator/membership/create'
    }
  ]

  const onChangeTitle = e => {
    setTitle(e.target.value)
    setSlug(e.target.value.toLowerCase().replaceAll(' ', '-'))
  }

  const handleOnSubmitCreateMembershipForm = async e => {
    e.preventDefault()
    await MyAxios.post('/creator/membership', {
      creatorId: 5,
      name: title,
      slug: slug,
      description: description,
      price: price
    })
      .then(ret => {
        console.log(ret.data)
        router.push('/creator/membership')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Breadcrumb data={dataBreadcrumb} />
      <Typography variant='h5' sx={{ mb: 2 }}>
        Create Membership
      </Typography>
      <form action='' method='post' onSubmit={handleOnSubmitCreateMembershipForm}>
        <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
          <TextField
            sx={{ width: '50vw' }}
            label='Title'
            variant='outlined'
            value={title}
            onChange={e => onChangeTitle(e)}
          />
          <TextField label='Slug' sx={{ width: '50vw' }} value={slug} disabled />
          <TextField
            label='Description'
            multiline
            rows={4}
            sx={{ width: '50vw' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            label='Price'
            type='number'
            sx={{ width: '50vw' }}
            value={price}
            onChange={e => setPrice(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
            }}
          />
          <Button type='submit' variant='contained'>
            Create
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default page
