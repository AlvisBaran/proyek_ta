'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import FolderIcon from '@mui/icons-material/Folder'

import MyAxios from '@/hooks/MyAxios'
import UserPageLayout from '../_components/layout'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'on-progress', label: 'On Progress' },
  { value: 'waiting-requestor-confirmation', label: 'Waiting Requestor Confirmation' },
  { value: 'waiting-payment', label: 'Waiting Payment' },
  { value: 'waiting-creator-confirmation', label: 'Waiting Creator Confirmation' },
  { value: 'done', label: 'Done' }
]

const contentRequestsDefaultValues = { data: [], loading: false, success: false, error: false }

const baseColumns = [
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Requested At',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'updatedAt',
    headerName: 'Last Update',
    valueGetter: params => new Date(params.value)
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
          label={String(params.value).toUpperCase().replaceAll('-', ' ')}
          color={
            params.value === 'done'
              ? 'success'
              : params.value === 'waiting-requestor-confirmation' || params.value === 'waiting-payment'
                ? 'info'
                : 'warning'
          }
        />
      )
    }
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'requestNote',
    headerName: 'Request Note'
  },
  {
    flex: 0.8,
    minWidth: 120,
    type: 'boolean',
    field: 'price',
    headerName: 'Price',
    valueGetter: params => !!params.value
  },
  {
    flex: 0.8,
    minWidth: 120,
    type: 'boolean',
    field: 'contentRef',
    headerName: 'Content',
    valueGetter: params => !!params.value
  }
]

export const dynamic = 'force-dynamic'

export default function UserRequestContentPage() {
  const router = useRouter()
  const session = useSession()
  const user = getUserFromComposedSession(session.data)
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterStatus, setFilterStatus] = useState('all')
  const [contentRequests, setContentRequests] = useState(contentRequestsDefaultValues)

  // * Fetch Data
  async function fetchContentRequests() {
    setContentRequests({ ...contentRequests, loading: true, error: false, success: false })
    await MyAxios.get('/user/content-request', {
      params: {
        status: filterStatus === 'all' ? null : filterStatus
      }
    })
      .then(resp => {
        setContentRequests({ ...contentRequests, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContentRequests({ ...contentRequests, data: [], loading: false, error: true })
      })
  }

  // * Fetch Caller
  useEffect(() => {
    fetchContentRequests()
  }, [filterStatus])

  // * Grid Actions
  const columns = [
    {
      flex: 0.8,
      minWidth: 120,
      type: 'boolean',
      field: 'applicantRef',
      headerName: 'By You?',
      valueGetter: params => params.value === user?.id
    },
    ...baseColumns,
    {
      width: 160,
      filterable: false,
      sortable: false,
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key={`request-content-list-action-item-${row.id}-detail`}
          label='Detail'
          color='primary'
          icon={<FolderIcon />}
          onClick={() => router.push(`/request-content/${row.id}/detail`)}
        />
      ]
    }
  ]

  return (
    <UserPageLayout appbarTitle='Request Content'>
      <Stack gap={2}>
        <Stack direction='row' justifyContent='end' gap={upMd ? 2 : 1} flexWrap='wrap'>
          <FormControl fullWidth={!upMd} size='small' sx={{ minWidth: 280 }}>
            <InputLabel id='request-content-status-filter-label'>Status</InputLabel>
            <Select
              labelId='request-content-status-filter-label'
              id='request-content-status-filter'
              label='Status'
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              {statusOptions.map((item, index) => (
                <MenuItem key={`request-content-status-filter-item-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            fullWidth={!upMd}
            variant='contained'
            startIcon={<AddIcon />}
            LinkComponent={Link}
            href='/request-content/create'
          >
            New Request
          </Button>
        </Stack>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={contentRequests.data}
          loading={contentRequests.loading}
        />
      </Stack>
    </UserPageLayout>
  )
}
