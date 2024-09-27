'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Button, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import CreatorPageLayout from '../_components/layout'

import MembershipAddDialog from './_components/MembershipAddDialog'
import MembershipEditDialog from './_components/MembershipEditDialog'

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
    minWidth: 160,
    type: 'string',
    field: 'slug',
    headerName: 'Slug'
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'description',
    headerName: 'Description'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'price',
    headerName: 'Price (Rp)'
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'interval',
    headerName: 'Interval (day)'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Created At',
    valueGetter: params => new Date(params.value)
  }
  // {
  //   flex: 1,
  //   minWidth: 120,
  //   type: 'custom',
  //   field: 'status',
  //   headerName: 'Status',
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: params => {
  //     const isDraft = params.value === 'draft'
  //     return <Chip size='small' label={String(params.value).toUpperCase()} color={isDraft ? 'error' : 'success'} />
  //   }
  // },
]

const membershipsDefaultValues = { data: [], loading: false, error: false, success: false }
const deleteDefaultValues = { loading: false, error: false, success: false }
// const publishUnpublishDefaultValues = { loading: false, error: false, success: false }

export default function CreatorMasterMembershipPage() {
  const { pushConfirm } = useDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [editValue, setEditValue] = useState({ id: null, open: false })
  const [memberships, setMemberships] = useState(membershipsDefaultValues)
  const [deleteValue, setDeleteValue] = useState(deleteDefaultValues)
  // const [publishUnpublish, setPublishUnpublish] = useState(publishUnpublishDefaultValues)

  // * Fetch Categories
  async function fetchData() {
    setMemberships({ ...memberships, loading: true, error: false, success: false })
    await MyAxios.get('/creator/membership', {
      params: {
        keyword: searchValue
      }
    })
      .then(resp => {
        setMemberships({ ...memberships, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setMemberships({ ...memberships, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [searchValue])

  // // * Publish Or Unpublish
  // async function handlePublishUnpublish({ id, status }) {
  //   setPublishUnpublish({ ...publishUnpublish, loading: true, error: false, success: false })
  //   await MyAxios.put(`/creator/content/${id}/publish_status`, {
  //     type: status == 'draft' ? 'publish' : 'unpublish'
  //   })
  //     .then(resp => {
  //       toast.success(`Success ${status == 'draft' ? 'publish' : 'draft'} content!`)
  //       setPublishUnpublish({ ...publishUnpublish, loading: false, success: true })
  //       fetchData()
  //     })
  //     .catch(err => {
  //       console.error(err)
  //       toast.error(`Error ${status == 'draft' ? 'publish' : 'draft'} content!\n${err.response.data.message}`)
  //       setPublishUnpublish({ ...publishUnpublish, loading: false, success: true })
  //     })
  // }

  async function handleDelete(id) {
    setDeleteValue({ ...deleteValue, loading: true, success: false, error: false })
    await MyAxios.delete(`/creator/membership/${id}`)
      .then(resp => {
        toast.success('Success delete membership!')
        setDeleteValue({ ...deleteValue, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error delete membership!\n${err.response.data.message}`)
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
          // <GridActionsCellItem
          //   icon={params.row.status === 'draft' ? <PublishIcon /> : <UnpublishedIcon />}
          //   onClick={() =>
          //     handlePublishUnpublish({
          //       id: params.row.id,
          //       status: params.row.status
          //     })
          //   }
          //   label={params.row.status === 'draft' ? 'Publish' : 'Draft'}
          //   showInMenu
          // />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label={'Edit Membership'}
            onClick={() => setEditValue({ id: params.row.id, open: true })}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            onClick={() =>
              pushConfirm({
                title: 'Delete Membership?',
                content: 'Are you sure you want to delete?',
                onAgreeBtnClick: () => handleDelete(params.row.id)
              })
            }
            label={'Delete Membership'}
            showInMenu
          />
        ]
      }
    }
  ]

  return (
    <CreatorPageLayout appbarTitle='Master Membership'>
      <Breadcrumb
        data={[
          {
            title: 'Master Membership',
            url: '/creator/membership'
          }
        ]}
        action={
          <Fragment>
            <TextField
              size='small'
              placeholder='Search Membership'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
              Add New
            </Button>
          </Fragment>
        }
      />
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={memberships.data}
          loading={memberships.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>

      <MembershipAddDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSuccess={fetchData} />
      <MembershipEditDialog
        id={editValue.id}
        open={editValue.open}
        onClose={() => setEditValue({ id: null, open: false })}
        onSuccess={fetchData}
      />
    </CreatorPageLayout>
  )
}
