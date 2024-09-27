'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, TextField } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import CreatorPageLayout from '../_components/layout'

const baseColumns = [
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
    type: 'string',
    field: 'Membership.name',
    headerName: 'Membership Name',
    valueGetter: params => params.row.Membership.name
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'grandTotal',
    headerName: 'Grand Total (Rp)'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Purchase Date',
    valueGetter: params => new Date(params.value)
  }
]

const transactionsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorMembershipTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [transactions, setTransactions] = useState(transactionsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setTransactions({ ...transactions, loading: true, error: false, success: false })
    await MyAxios.get('/creator/transactions/membership', {
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
    <CreatorPageLayout appbarTitle='Membership Transactions'>
      <Breadcrumb
        data={[
          {
            title: 'Membership Transactions',
            url: '/creator/membership-transactions'
          }
        ]}
        action={
          <Fragment>
            <TextField
              size='small'
              placeholder='Search Transaction'
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
    </CreatorPageLayout>
  )
}
