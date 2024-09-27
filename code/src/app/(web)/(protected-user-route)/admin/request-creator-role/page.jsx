'use client'

import { Fragment, useEffect, useState } from 'react'

import { Box, Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import NotInterestedIcon from '@mui/icons-material/NotInterested'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import AdminPageLayout from '../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

import ApproveDeclineDialog from './_components/ApproveDeclineDialog'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' }
]

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'Applicant.displayName',
    headerName: 'User Name',
    valueGetter: params => params.row.Applicant?.displayName
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'Applicant.email',
    headerName: 'User Email',
    valueGetter: params => params.row.Applicant?.email
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'newUsername',
    headerName: 'Username'
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
            params.value === 'requested'
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
    minWidth: 180,
    type: 'dateTime',
    field: 'requestedAt',
    headerName: 'Requested At',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'modifiedAt',
    headerName: 'Last Update',
    valueGetter: params => (!!params.value ? new Date(params.value) : null)
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'adminNote',
    headerName: 'Admin Note'
  }
]

const requestsDefaultValues = { data: [], loading: false, error: false, success: false }
const approveOrDeclineValueDefaltValues = { id: null, newUsername: null, type: null, open: false }

export default function AdminRequestCreatorRolePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const [requests, setRequests] = useState(requestsDefaultValues)
  const [approveOrDeclineValue, setApproveOrDeclineValue] = useState(approveOrDeclineValueDefaltValues)

  // * Fetch Requests
  async function fetchData() {
    setRequests({ ...requests, loading: true, error: false, success: false })
    await MyAxios.get('/admin/account-upgrade', {
      params: {
        keyword: searchValue,
        filterStatus: filterStatus === 'all' ? undefined : filterStatus
      }
    })
      .then(resp => {
        setRequests({ ...requests, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setRequests({ ...requests, data: [], loading: false, error: true })
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
        if (params.row.status === 'requested')
          menus.push(
            <GridActionsCellItem
              icon={<CheckCircleOutlineIcon />}
              label='Approve'
              onClick={() =>
                setApproveOrDeclineValue({
                  id: params.row.id,
                  newUsername: params.row.newUsername,
                  type: 'approve',
                  open: true
                })
              }
              showInMenu
            />,
            <GridActionsCellItem
              icon={<NotInterestedIcon />}
              label='Decline'
              onClick={() =>
                setApproveOrDeclineValue({
                  id: params.row.id,
                  newUsername: params.row.newUsername,
                  type: 'decline',
                  open: true
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
    <AdminPageLayout appbarTitle='Request Creator Role'>
      <Breadcrumb
        data={[
          {
            title: 'Request Creator Role',
            url: '/admin/request-creator-role'
          }
        ]}
        action={
          <Fragment>
            <FormControl size='small' sx={{ minWidth: 160 }}>
              <InputLabel id='admin-request-creator-role-status-filter-label'>Status</InputLabel>
              <Select
                labelId='admin-request-creator-role-status-filter-label'
                id='admin-request-creator-role-status-filter'
                label='Status'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((item, index) => (
                  <MenuItem key={`admin-request-creator-role-status-filter-item-${index}`} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          rows={requests.data}
          loading={requests.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>

      {approveOrDeclineValue.open ? (
        <ApproveDeclineDialog
          id={approveOrDeclineValue.id}
          newUsername={approveOrDeclineValue.newUsername}
          type={approveOrDeclineValue.type}
          open={approveOrDeclineValue.open}
          onClose={() => setApproveOrDeclineValue(approveOrDeclineValueDefaltValues)}
          onSuccess={() => fetchData()}
        />
      ) : null}
    </AdminPageLayout>
  )
}
