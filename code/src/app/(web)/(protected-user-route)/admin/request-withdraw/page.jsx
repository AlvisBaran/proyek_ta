'use client'

import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// import FolderIcon from '@mui/icons-material/Folder'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { useDialog } from '@/hooks/useDialog'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import { labelBuilder } from '@/utils/labelBuilder'
import AdminPageLayout from '../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

import ApproveDialog from './_components/ApproveDialog'

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
    type: 'string',
    field: 'User.displayName',
    headerName: 'Creator Name',
    valueGetter: params => params.row.User.displayName
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'string',
    field: 'User.cUsername',
    headerName: 'Creator Username',
    valueGetter: params => params.row.User.cUsername
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
    field: 'nomorRekening',
    headerName: 'Account Number'
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
const approveDefaultValues = { id: null, open: false }
const rejectWithdrawDefaultValues = { loading: false, error: false, success: false }

export default function AdminWithdrawPage() {
  const { pushConfirm } = useDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const [withdraws, setWithdraws] = useState(withdrawsDefaultValues)
  const [approveValues, setApproveValues] = useState(approveDefaultValues)
  const [reject, setReject] = useState(rejectWithdrawDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setWithdraws({ ...withdraws, loading: true, error: false, success: false })
    await MyAxios.get('/admin/request-withdraw', {
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

  // * Reject Withdraw
  async function handleRejectWithdraw(withdrawId) {
    setReject({ ...reject, loading: true, success: false, error: false })
    const formData = new FormData()
    formData.append('action', 'reject')
    await MyAxios.put(`/admin/request-withdraw/${withdrawId}`, formData)
      .then(resp => {
        toast.success('Success reject withdraw!')
        setReject({ ...reject, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed reject withdraw!\n${err.response.data.message}`)
        setReject({ ...reject, loading: false, error: true })
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
        const menus = []
        if (params.row.status === 'on-hold')
          menus.push(
            <GridActionsCellItem
              icon={<CheckCircleOutlineIcon />}
              label={'Accept'}
              onClick={() =>
                pushConfirm({
                  title: 'Approve Withdraw?',
                  content: 'Are you sure to approve this withdraw?',
                  onAgreeBtnClick: () => setApproveValues({ id: params.row.id, open: true })
                })
              }
              showInMenu
            />,
            <GridActionsCellItem
              icon={<CancelOutlinedIcon />}
              label={'Reject'}
              onClick={() =>
                pushConfirm({
                  title: 'Reject Withdraw?',
                  content: 'Are you sure to reject this withdraw?',
                  onAgreeBtnClick: () => handleRejectWithdraw(params.row.id)
                })
              }
              showInMenu
            />
          )

        return menus
      }
    }
  ]

  return (
    <AdminPageLayout appbarTitle='Withdraw'>
      <Breadcrumb
        data={[
          {
            title: 'Withdraw',
            url: '/admin/withdraw'
          }
        ]}
        action={
          <Fragment>
            <FormControl size='small' sx={{ minWidth: 160 }}>
              <InputLabel id='admin-withdraw-filter-status-label'>Status</InputLabel>
              <Select
                labelId='admin-withdraw-filter-status-label'
                id='admin-withdraw-filter-status'
                label='Status'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((item, index) => (
                  <MenuItem key={`admin-withdraw-filter-status-item-${index}`} value={item.value}>
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

      <ApproveDialog
        id={approveValues.id}
        open={approveValues.open}
        onClose={() => setApproveValues(approveDefaultValues)}
        onSuccess={fetchData}
      />
    </AdminPageLayout>
  )
}
