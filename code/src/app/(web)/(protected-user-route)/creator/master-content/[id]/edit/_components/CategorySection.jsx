'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Button, Stack, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import SaveIcon from '@mui/icons-material/Save'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import PageHeader from '@/app/(web)/_components/PageHeader'

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'label',
    headerName: 'Label'
  }
]

const categoriesDefaultValues = { data: [], loading: false, error: false, success: false }
const updateCategoriesDefaultValues = { loading: false, error: false, success: false }

export default function CategorySection({ content, fetchContent }) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [categories, setCategories] = useState(categoriesDefaultValues)
  const [updateCategories, setUpdateCategories] = useState(updateCategoriesDefaultValues)
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [firstLoad, setFirstLoad] = useState(true)

  // * Fetch Data
  async function fetchCategories() {
    setCategories({ ...categories, loading: true, success: false, error: false })
    await MyAxios.get('/category', { params: { keyword: searchValue } })
      .then(resp => {
        setCategories({ ...categories, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCategories({ ...categories, data: [], loading: false, error: true })
      })
  }

  // * Update Data
  async function handleUpdateCategories() {
    setUpdateCategories({ ...updateCategories, loading: true, success: false, error: false })
    await MyAxios.put(`/creator/content/${content.data.id}/bind-category`, {
      categoryIds: rowSelectionModel
    })
      .then(resp => {
        toast.success('Success update categories!')
        setUpdateCategories({ ...updateCategories, loading: false, success: true })
        setFirstLoad(true)
        fetchContent()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed update categories!\n${err.response.data.message}`)
        setUpdateCategories({ ...updateCategories, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchCategories()
  }, [searchValue])

  // * On Content Change
  useEffect(() => {
    if (
      !categories.loading &&
      categories.success &&
      !!content &&
      !!content.data &&
      !!content.data.Categories &&
      firstLoad
    ) {
      setRowSelectionModel(content.data.Categories?.map(item => item.id) ?? [])
      setFirstLoad(false)
    }
  }, [content, categories.loading])

  // * Grid Actions
  const columns = [...baseColumns]

  return (
    <Box>
      <PageHeader
        title='Category'
        subTitle="Set content's categories"
        action={
          <Button
            variant='contained'
            startIcon={<SaveIcon />}
            disabled={content.loading || categories.loading || updateCategories.loading}
            onClick={handleUpdateCategories}
          >
            {updateCategories.loading ? 'Loading...' : 'Save'}
          </Button>
        }
      />
      <Stack direction='row' justifyContent='end' gap={2} my={1}>
        <TextField
          size='small'
          placeholder='Search Category'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Stack>
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={categories.data}
          loading={categories.loading}
          checkboxSelection
          disableRowSelectionOnClick={false}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={newSelectionModel => setRowSelectionModel(newSelectionModel)}
        />
      </Box>
    </Box>
  )
}
