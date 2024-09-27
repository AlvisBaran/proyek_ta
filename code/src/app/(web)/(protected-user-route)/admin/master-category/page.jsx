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
import AdminPageLayout from '../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

import CategoryAddDialog from './_components/CategoryAddDialog'
import CategoryEditDialog from './_components/CategoryEditDialog'

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'label',
    headerName: 'Label'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Created At',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'updatedAt',
    headerName: 'Updated At',
    valueGetter: params => (!!params.value ? new Date(params.value) : null)
  }
  // {
  //   flex: 1,
  //   minWidth: 180,
  //   type: 'dateTime',
  //   field: 'deletedAt',
  //   headerName: 'Deleted At',
  //   valueGetter: params => (!!params.value ? new Date(params.value) : null)
  // }
]

const categoriesDefaultValues = { data: [], loading: false, error: false, success: false }
const deleteCategoryDefaultValues = { loading: false, error: false, success: false }

export default function AdminMasterCategoryPage() {
  const { pushConfirm } = useDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [categories, setCategories] = useState(categoriesDefaultValues)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [editValue, setEditValue] = useState({ id: null, open: false })
  const [deleteCategory, setDeleteCategory] = useState(deleteCategoryDefaultValues)

  // * Fetch Categories
  async function fetchData() {
    setCategories({ ...categories, loading: true, error: false, success: false })
    await MyAxios.get('/admin/category', {
      params: {
        keyword: searchValue
      }
    })
      .then(resp => {
        setCategories({ ...categories, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCategories({ ...categories, data: [], loading: false, error: true })
      })
  }

  // * Delete Category
  async function deleteData(id) {
    setDeleteCategory({ ...deleteCategory, loading: true, error: false, success: false })
    await MyAxios.delete(`/admin/category/${id}`)
      .then(resp => {
        toast.success('Success delete category!')
        setDeleteCategory({ ...deleteCategory, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error delete category!\n${err.response.data.message}`)
        setDeleteCategory({ ...deleteCategory, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [searchValue])

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
            icon={<EditIcon />}
            label='Edit'
            onClick={() => setEditValue({ id: params.row.id, open: true })}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Delete'
            onClick={() =>
              pushConfirm({
                title: 'Delete Category?',
                content: 'Are you sure you want to delete?',
                onAgreeBtnClick: () => deleteData(params.row.id)
              })
            }
            showInMenu
          />
        ]
      }
    }
  ]

  return (
    <AdminPageLayout appbarTitle='Master Category'>
      <Breadcrumb
        data={[
          {
            title: 'Master Category',
            url: '/admin/master-category'
          }
        ]}
        action={
          <Fragment>
            <TextField
              size='small'
              placeholder='Search Category'
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
          rows={categories.data}
          loading={categories.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />

        <CategoryAddDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSuccess={() => fetchData()} />
        <CategoryEditDialog
          id={editValue.id}
          open={editValue.open}
          onClose={() => setEditValue({ id: null, open: false })}
          onSuccess={() => fetchData()}
        />
      </Box>
    </AdminPageLayout>
  )
}
