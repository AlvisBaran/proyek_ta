'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Chip, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import AdminPageLayout from '../_components/layout'

const baseColumns = [
  {
    flex: 1,
    minWidth: 120,
    type: 'boolean',
    field: 'isDeleted',
    headerName: 'Deleted',
    valueGetter: params => !!params.row.deletedAt
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'User.displayName',
    headerName: 'User Name',
    valueGetter: params => params.row.User.displayName
  },
  {
    flex: 1,
    minWidth: 160,
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
            params.value === 'pending'
              ? 'warning'
              : params.value === 'success'
                ? 'success'
                : params.value === 'failed'
                  ? 'error'
                  : 'default'
          }
        />
      )
    }
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'nominal',
    headerName: 'Nominal (Rp)'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Purchase Date',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'deletedAt',
    headerName: 'Deleted At',
    valueGetter: params => (!!params.value ? new Date(params.value) : '')
  }
]

const transactionsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function AdminTopupHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [transactions, setTransactions] = useState(transactionsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setTransactions({ ...transactions, loading: true, error: false, success: false })
    await MyAxios.get('/admin/transactions/top-up', {
      params: { keyword: searchValue }
    })
      .then(resp => {
        setTransactions({ ...transactions, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to load transactions data.\n${err.response.data.message}`)
        setTransactions({ ...transactions, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [searchValue])

  // * Grid Actions
  const columns = [...baseColumns]

  return (
    <AdminPageLayout appbarTitle='Top Up History'>
      <Breadcrumb
        data={[
          {
            title: 'Top Up History',
            url: '/admin/topup-history'
          }
        ]}
        action={
          <Fragment>
            <TextField
              size='small'
              placeholder='Search'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Fragment>
        }
      />
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={transactions.data}
          loading={transactions.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>
    </AdminPageLayout>
  )
}
