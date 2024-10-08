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
    field: 'name',
    headerName: 'Name'
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'description',
    headerName: 'Description'
  }
]

const membershipsDefaultValues = { data: [], loading: false, error: false, success: false }
const updateMembershipsDefaultValues = { loading: false, error: false, success: false }

export default function MembershipSection({ content, fetchContent }) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [memberships, setMemberships] = useState(membershipsDefaultValues)
  const [updateMemberships, setUpdateMemberships] = useState(updateMembershipsDefaultValues)
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [firstLoad, setFirstLoad] = useState(true)
  const contentRequest =
    !!content.data && !!content.data.ContentRequests && !!content.data.ContentRequests[0]
      ? content.data.ContentRequests[0]
      : null
  const disableEdit = !!contentRequest && contentRequest.status === 'done'

  // * Fetch Data
  async function fetchMemberships() {
    setMemberships({ ...memberships, loading: true, success: false, error: false })
    await MyAxios.get('/creator/membership', { params: { keyword: searchValue } })
      .then(resp => {
        setMemberships({ ...memberships, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMemberships({ ...memberships, data: [], loading: false, error: true })
      })
  }

  // * Update Data
  async function handleUpdateMemberships() {
    setUpdateMemberships({ ...updateMemberships, loading: true, success: false, error: false })
    await MyAxios.put(`/creator/content/${content.data.id}/bind-membership`, {
      membershipIds: rowSelectionModel
    })
      .then(resp => {
        toast.success('Success update memberships!')
        setUpdateMemberships({ ...updateMemberships, loading: false, success: true })
        setFirstLoad(true)
        fetchContent()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed update memberships!\n${err.response.data.message}`)
        setUpdateMemberships({ ...updateMemberships, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchMemberships()
  }, [searchValue])

  // * On Content Change
  useEffect(() => {
    if (
      !memberships.loading &&
      memberships.success &&
      !!content &&
      !!content.data &&
      !!content.data.Memberships &&
      firstLoad
    ) {
      setRowSelectionModel(content.data.Memberships?.map(item => item.id) ?? [])
      setFirstLoad(false)
    }
  }, [content, memberships.loading])

  // * Grid Actions
  const columns = [...baseColumns]

  return (
    <Box>
      <PageHeader
        title='Membership'
        subTitle="Set content's memberships"
        action={
          <Button
            variant='contained'
            startIcon={<SaveIcon />}
            disabled={content.loading || memberships.loading || updateMemberships.loading || disableEdit}
            onClick={handleUpdateMemberships}
          >
            {updateMemberships.loading ? 'Loading...' : 'Save'}
          </Button>
        }
      />
      <Stack direction='row' justifyContent='end' gap={2} my={1}>
        <TextField
          size='small'
          placeholder='Search Membership'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Stack>
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={memberships.data}
          loading={memberships.loading}
          checkboxSelection
          disableRowSelectionOnClick={false}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={newSelectionModel => setRowSelectionModel(newSelectionModel)}
        />
      </Box>
    </Box>
  )
}
