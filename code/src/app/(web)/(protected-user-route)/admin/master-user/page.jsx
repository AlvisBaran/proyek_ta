'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Chip, TextField } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import NotInterestedIcon from '@mui/icons-material/NotInterested'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import AdminPageLayout from '../_components/layout'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'cUsername',
    headerName: 'Username'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'email',
    headerName: 'Email'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'displayName',
    headerName: 'Display Name'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'custom',
    align: 'center',
    headerAlign: 'center',
    field: 'role',
    headerName: 'Role',
    renderCell: params => {
      return (
        <Chip
          size='small'
          label={String(params.value).toUpperCase().replaceAll('-', ' ')}
          color={
            params.value === 'admin'
              ? 'error'
              : params.value === 'normal'
                ? 'primary'
                : params.value === 'creator'
                  ? 'warning'
                  : 'default'
          }
        />
      )
    }
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'custom',
    align: 'center',
    headerAlign: 'center',
    field: 'banStatus',
    headerName: 'Ban Status',
    renderCell: params => {
      return (
        <Chip
          size='small'
          label={String(params.value).toUpperCase().replaceAll('-', ' ')}
          color={
            params.value === 'clean'
              ? 'success'
              : params.value === 'banned'
                ? 'error'
                : params.value === 'unbanned'
                  ? 'warning'
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
    field: 'joinDate',
    headerName: 'Joined At',
    valueGetter: params => new Date(params.value)
  }
]

const usersDefaultValues = { data: [], loading: false, error: false, success: false }
const banUnbanDefaultValues = { loading: false, error: false, success: false }

export default function AdminMasterUserPage() {
  const { pushConfirm } = useDialog()
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [users, setUsers] = useState(usersDefaultValues)
  const [banUnban, setBanUnban] = useState(banUnbanDefaultValues)

  // * Fetch Users
  async function fetchData() {
    setUsers({ ...users, loading: true, error: false, success: false })
    await MyAxios.get('/admin/user', {
      params: {
        keyword: searchValue
      }
    })
      .then(resp => {
        setUsers({ ...users, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setUsers({ ...users, data: [], loading: false, error: true })
      })
  }

  // * Ban Or Unban User
  async function banOrUnbanUser({ id, status }) {
    setBanUnban({ ...banUnban, loading: false, error: false, success: false })
    await MyAxios.put(`/admin/user/${id}/ban_status`, {
      type: status === 'banned' ? 'unban' : 'ban'
    })
      .then(resp => {
        toast.success(resp.data.message)
        setBanUnban({ ...banUnban, loading: true, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(err.response.data.message)
        setBanUnban({ ...banUnban, loading: true, error: true })
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
            sx={params.row.role == 'admin' ? { display: 'none' } : {}}
            icon={
              params.row.banStatus === 'clean' || params.row.banStatus === 'unbanned' ? (
                <NotInterestedIcon />
              ) : (
                <CheckCircleOutlineIcon />
              )
            }
            onClick={() =>
              pushConfirm({
                title: params.row.banStatus === 'banned' ? 'Unban User' : 'Ban User',
                content: 'Are you sure about this action?',
                onAgreeBtnClick: () => banOrUnbanUser({ id: params.row.id, status: params.row.banStatus })
              })
            }
            label={params.row.banStatus === 'clean' || params.row.banStatus === 'unbanned' ? 'Ban User' : 'Unban User'}
            showInMenu
          />
        ]
      }
    }
  ]

  return (
    <AdminPageLayout appbarTitle='Master User'>
      <Breadcrumb
        data={[
          {
            title: 'Master User',
            url: '/admin/master-user'
          }
        ]}
        action={
          <TextField
            size='small'
            placeholder='Search Users'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        }
      />
      <Box sx={{ maxWidth: '88vw' }}>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={users.data}
          loading={users.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
      </Box>
    </AdminPageLayout>
  )
}
