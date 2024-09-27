'use client'

import { Fragment, useEffect, useState } from 'react'

import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import FolderIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import { labelBuilder } from '@/utils/labelBuilder'
import CreatorPageLayout from '../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

import AddWithdrawDialog from './_components/AddWithdrawDialog'
import DetailWithdrawDialog from './_components/DetailWithdrawDialog'
import EditWithdrawDialog from './_components/EditWithdrawDialog'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' }
]

const baseColumns = [
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Request Time',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'custom',
    align: 'center',
    headerAlign: 'center',
    field: 'status',
    headerName: 'Status',
    renderCell: params => {
      return (
        <Chip
          size='small'
          label={String(params.value).toUpperCase()}
          color={
            params.value === 'on-hold'
              ? 'warning'
              : params.value === 'approved'
                ? 'success'
                : params.value === 'declined'
                  ? 'error'
                  : 'default'
          }
        />
      )
    }
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'nominal',
    headerName: 'Nominal (Rp)'
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'string',
    field: 'Bank',
    headerName: 'Bank',
    valueGetter: params => labelBuilder.Bank(params.row.Bank)
  }
]

const withdrawsDefaultValues = { data: [], loading: false, success: false, error: false }
const detailEditDialogDefaultValues = { id: null, open: false }

export default function CreatorWithdrawPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const [withdraws, setWithdraws] = useState(withdrawsDefaultValues)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [detailDialogValues, setDetailDialogValues] = useState(detailEditDialogDefaultValues)
  const [editDialogValues, setEditDialogValues] = useState(detailEditDialogDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setWithdraws({ ...withdraws, loading: true, error: false, success: false })
    await MyAxios.get('/creator/request-withdraw', {
      params: { keyword: searchValue, filterStatus: filterStatus !== 'all' ? filterStatus : undefined }
    })
      .then(resp => {
        setWithdraws({ ...withdraws, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setWithdraws({ ...withdraws, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [searchValue, filterStatus])

  // * Grid Actions
  const columns = [
    ...baseColumns,
    {
      width: 120,
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: params => {
        const menus = [
          <GridActionsCellItem
            icon={<FolderIcon />}
            onClick={() => setDetailDialogValues({ id: params.row.id, open: true })}
            label={'Detail'}
            showInMenu
          />
        ]

        if (params.row.status === 'on-hold')
          menus.push(
            <GridActionsCellItem
              icon={<EditIcon />}
              onClick={() => setEditDialogValues({ id: params.row.id, open: true })}
              label={'Edit'}
              showInMenu
            />
          )

        return menus
      }
    }
  ]

  return (
    <CreatorPageLayout appbarTitle='Withdraw'>
      <Breadcrumb
        data={[
          {
            title: 'Withdraw',
            url: '/creator/withdraw'
          }
        ]}
        action={
          <Fragment>
            <FormControl size='small' sx={{ minWidth: 160 }}>
              <InputLabel id='creator-withdraw-filter-status-label'>Status</InputLabel>
              <Select
                labelId='creator-withdraw-filter-status-label'
                id='creator-withdraw-filter-status'
                label='Status'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((item, index) => (
                  <MenuItem key={`creator-withdraw-filter-status-item-${index}`} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size='small'
              placeholder='Search Withdraw'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button variant='contained' startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
              New Request
            </Button>
          </Fragment>
        }
      />
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={withdraws.data}
          loading={withdraws.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>

      <AddWithdrawDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSuccess={fetchData} />
      <DetailWithdrawDialog
        id={detailDialogValues.id}
        open={detailDialogValues.open}
        onClose={() => setDetailDialogValues(detailEditDialogDefaultValues)}
      />
      <EditWithdrawDialog
        id={editDialogValues.id}
        open={editDialogValues.open}
        onClose={() => setEditDialogValues(detailEditDialogDefaultValues)}
        onSuccess={fetchData}
      />
    </CreatorPageLayout>
  )
}
