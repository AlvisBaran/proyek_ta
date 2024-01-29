"use client";
import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import MyAxios from '@/hooks/MyAxios';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const router = useRouter()

  const dataBreadcrumb = [
    {
      title: "Master Konten",
      url: "/creator/master-content",
    },
    {
      title: "Create Konten",
      url: "/creator/master-content/create",
    }
  ]
  const handleOnSubmitCreateContentForm = async(e) => {
    e.preventDefault()
    await MyAxios.post('/creator/content', {
      creatorId: 5,
      type: type,
      title: title,
      body: `<p>${description}</p>`
    })
    .then(ret => {
      console.log(ret.data)
      router.push('/creator/master-content')
    })
    .catch(err => {
      console.log(err)
    })
  }
  return (
    <Box sx={{maxWidth: '100vw'}}>
      <Breadcrumb data={dataBreadcrumb}/>
      <Typography variant='h5' sx={{mb:2}}>
        Create Konten
      </Typography>
      <form action="" method="post" onSubmit={handleOnSubmitCreateContentForm}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <TextField sx={{width: '50vw'}} label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            label="Caption"
            multiline
            rows={4}
            sx={{width: '50vw'}}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputLabel id="type-select-label">Content Type</InputLabel>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={type}
              sx={{width: '50vw'}}
              label="Content Type"
              onChange={(e) => {setType(e.target.value)}}
            >
              <MenuItem value={'private'}>Private</MenuItem>
              <MenuItem value={'public'}>Public</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">Create</Button>
        </Stack>
      </form>
    </Box>
  )
}

export default page