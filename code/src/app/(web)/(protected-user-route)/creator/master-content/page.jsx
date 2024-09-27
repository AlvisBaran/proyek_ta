'use client'

import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import CreatorPageLayout from '../_components/layout'

const publishStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft-only', label: 'Draft' },
  { value: 'published-only', label: 'Published' }
]

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'title',
    headerName: 'Title'
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'description',
    headerName: 'Description'
  },
  // {
  //   flex: 1,
  //   minWidth: 120,
  //   type: 'custom',
  //   field: 'type',
  //   headerName: 'Type',
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: params => {
  //     return <Chip size='small' label={String(params.value).toUpperCase()} />
  //   }
  // },
  {
    flex: 1,
    minWidth: 120,
    type: 'custom',
    field: 'status',
    headerName: 'Status',
    align: 'center',
    headerAlign: 'center',
    renderCell: params => {
      const isDraft = params.value === 'draft'
      return <Chip size='small' label={String(params.value).toUpperCase()} color={isDraft ? 'error' : 'success'} />
    }
  },
  // {
  //   field: 'categories',
  //   headerName: 'Categories',
  //   width: 'fit-content',
  //   editable: false,
  //   renderCell: (params) => {
  //     return <ChipGroup data={params.value} color={"success"} />;
  //   }
  // },
  {
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'likeCounter',
    headerName: 'Likes'
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'shareCounter',
    headerName: 'Shares'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Created At',
    valueGetter: params => new Date(params.value)
  }
]

const contentsDefaultValues = { data: [], loading: false, error: false, success: false }
const publishUnpublishDefaultValues = { loading: false, error: false, success: false }
const deleteDefaultValues = { loading: false, error: false, success: false }

export default function CreatorMasterContentPage() {
  const router = useRouter()
  const { pushConfirm } = useDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterPublishStatus, setFilterPublishStatus] = useState('all')
  const [contents, setContents] = useState(contentsDefaultValues)
  const [publishUnpublish, setPublishUnpublish] = useState(publishUnpublishDefaultValues)
  const [deleteValue, setDeleteValue] = useState(deleteDefaultValues)

  // * Fetch Contents
  async function fetchData() {
    setContents({ ...contents, loading: true, error: false, success: false })
    await MyAxios.get('/creator/content', {
      params: {
        keyword: searchValue,
        filterPublishStatus: filterPublishStatus === 'all' ? undefined : filterPublishStatus
      }
    })
      .then(resp => {
        setContents({ ...contents, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContents({ ...contents, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [searchValue, filterPublishStatus])

  // * Publish Or Unpublish
  async function handlePublishUnpublish({ id, status }) {
    setPublishUnpublish({ ...publishUnpublish, loading: true, error: false, success: false })
    await MyAxios.put(`/creator/content/${id}/publish_status`, {
      type: status == 'draft' ? 'publish' : 'unpublish'
    })
      .then(resp => {
        toast.success(`Success ${status == 'draft' ? 'publish' : 'draft'} content!`)
        setPublishUnpublish({ ...publishUnpublish, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error ${status == 'draft' ? 'publish' : 'draft'} content!\n${err.response.data.message}`)
        setPublishUnpublish({ ...publishUnpublish, loading: false, success: true })
      })
  }

  // * Handle Delete Content
  async function handleDelete(id) {
    setDeleteValue({ ...deleteValue, loading: true, success: false, error: false })
    await MyAxios.delete(`/creator/content/${id}`)
      .then(resp => {
        toast.success('Success delete content!')
        setDeleteValue({ ...deleteValue, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error delete content!\n${err.response.data.message}`)
        setDeleteValue({ ...deleteValue, loading: false, error: true })
      })
  }

  // * Grid Actions
  const columns = [
    ...baseColumns,
    {
      width: 120,
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: params => {
        return [
          <GridActionsCellItem
            icon={params.row.status === 'draft' ? <PublishIcon /> : <UnpublishedIcon />}
            onClick={() =>
              handlePublishUnpublish({
                id: params.row.id,
                status: params.row.status
              })
            }
            label={params.row.status === 'draft' ? 'Publish' : 'Draft'}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={() => router.push(`/creator/master-content/${params.row.id}/edit`)}
            label={'Edit Content'}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            onClick={() =>
              pushConfirm({
                title: 'Delete Content?',
                content: 'Are you sure you want to delete?',
                onAgreeBtnClick: () => handleDelete(params.row.id)
              })
            }
            label={'Delete Content'}
            showInMenu
          />
        ]
      }
    }
  ]

  return (
    <CreatorPageLayout appbarTitle='Master Content'>
      <Breadcrumb
        data={[
          {
            title: 'Master Content',
            url: '/creator/master-content'
          }
        ]}
        action={
          <Fragment>
            <FormControl size='small' sx={{ minWidth: 160 }}>
              <InputLabel id='creator-master-content-filter-publish-status-filter-label'>Status</InputLabel>
              <Select
                labelId='creator-master-content-filter-publish-status-filter-label'
                id='creator-master-content-filter-publish-status-filter'
                label='Status'
                value={filterPublishStatus}
                onChange={e => setFilterPublishStatus(e.target.value)}
              >
                {publishStatusOptions.map((item, index) => (
                  <MenuItem
                    key={`creator-master-content-filter-publish-status-filter-item-${index}`}
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size='small'
              placeholder='Search Content'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button
              variant='contained'
              LinkComponent={Link}
              href={'/creator/master-content/create'}
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Fragment>
        }
      />
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={contents.data}
          loading={contents.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>
    </CreatorPageLayout>
  )
}
