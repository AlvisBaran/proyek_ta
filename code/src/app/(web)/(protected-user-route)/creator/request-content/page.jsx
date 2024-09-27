'use client'

import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import FolderIcon from '@mui/icons-material/Folder'

import MyAxios from '@/hooks/MyAxios'
import CreatorPageLayout from '../_components/layout'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import { useDebounce } from '@uidotdev/usehooks'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

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
    minWidth: 220,
    type: 'string',
    field: 'ContentRequestor.displayName',
    headerName: 'Requestor Name',
    valueGetter: params => params.row.ContentRequestor?.displayName
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'ContentRequestor.email',
    headerName: 'Requestor Email',
    valueGetter: params => params.row.ContentRequestor?.email
  },
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

export default function CreatorRequestContentPage() {
  const router = useRouter()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const [contentRequests, setContentRequests] = useState(contentRequestsDefaultValues)

  // * Fetch Data
  async function fetchContentRequests() {
    setContentRequests({ ...contentRequests, loading: true, error: false, success: false })
    await MyAxios.get('/creator/content-request', {
      params: {
        keyword: searchValue,
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
  }, [searchValue, filterStatus])

  // * Grid Actions
  const columns = [
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
          key={`creator-request-content-list-action-item-${row.id}-detail`}
          label='Detail'
          color='primary'
          icon={<FolderIcon />}
          onClick={() => router.push(`/creator/request-content/${row.id}/detail`)}
        />
      ]
    }
  ]

  return (
    <CreatorPageLayout appbarTitle='Content Request'>
      <Breadcrumb
        data={[
          {
            title: 'Content Request',
            url: '/creator/request-content'
          }
        ]}
        action={
          <Fragment>
            <FormControl fullWidth={!upMd} size='small' sx={{ minWidth: 280 }}>
              <InputLabel id='creator-request-content-status-filter-label'>Status</InputLabel>
              <Select
                labelId='creator-request-content-status-filter-label'
                id='creator-request-content-status-filter'
                label='Status'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((item, index) => (
                  <MenuItem key={`creator-request-content-status-filter-item-${index}`} value={item.value}>
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
          rows={contentRequests.data}
          loading={contentRequests.loading}
        />
      </Box>
    </CreatorPageLayout>
  )
}
