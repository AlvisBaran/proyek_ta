'use client'

import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import MultiSelect from '@/app/(web)/components/MultiSelect'
// import TextEditor from '@/app/(web)/components/TextEditor'
import dynamic from 'next/dynamic'
const TextEditor = dynamic(() => import('@/app/(web)/components/TextEditor'), { ssr: false })
import MyAxios from '@/hooks/MyAxios'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import StarterKit from '@tiptap/starter-kit'
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor
} from 'mui-tiptap'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
  const queryParams = useSearchParams()
  const id = queryParams.get('id')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [dataMembership, setDataMembership] = useState([])
  const [dataBindMembership, setDataBindMembership] = useState([])
  const rteRef = useRef(null)

  const dataBreadcrumb = [
    {
      title: 'Master Konten',
      url: '/creator/master-content'
    },
    {
      title: 'Edit Konten',
      url: `/creator/master-content/edit?id=${id}`
    }
  ]

  useEffect(() => {
    const fetch = async () => {
      await MyAxios.get(`/creator/content/${id}?creatorId=5`)
        .then(async ret => {
          console.log(ret.data)
          setTitle(ret.data.title)
          setDescription(ret.data.body)
          setType(ret.data.type)
          await MyAxios.get(`/creator/membership?creatorId=5`)
            .then(async ret => {
              setDataMembership(ret.data)
              await MyAxios.get(`/creator/content/${id}/bind-membership`).then(ret => {
                if (ret.data.length > 0) {
                  setDataBindMembership(ret.data.map(d => d.id))
                }
              })
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }

    fetch()
  }, [])

  const handleOnSubmitEditContentForm = () => {}

  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Breadcrumb data={dataBreadcrumb} />
      <Typography variant='h5' sx={{ mb: 2 }}>
        Edit Konten
      </Typography>
      <form action='' method='post' onSubmit={handleOnSubmitEditContentForm}>
        <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
          <TextField
            sx={{ width: '50vw' }}
            label='Title'
            variant='outlined'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {/* <TextField
            label="Caption"
            multiline
            rows={4}
            sx={{ width: '50vw' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}
          {/* <Typography variant="h6" color="initial">Caption</Typography> */}
          <Box sx={{ maxWidth: '50vw' }}>
            <TextEditor text={description} setText={setDescription} />
          </Box>
          <InputLabel id='type-select-label'>Content Type</InputLabel>
          <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId='type-select-label'
              id='type-select'
              value={type}
              sx={{ width: '50vw' }}
              label='Content Type'
              onChange={e => {
                setType(e.target.value)
              }}
            >
              <MenuItem value={'private'}>Private</MenuItem>
              <MenuItem value={'public'}>Public</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            id='tags-outlined'
            options={dataMembership}
            getOptionLabel={option => option.name}
            defaultValue={dataBindMembership}
            filterSelectedOptions
            size='large'
            renderInput={params => <TextField {...params} label='filterSelectedOptions' placeholder='Membership' />}
          />
          <Button type='submit' variant='contained'>
            Update
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default page
