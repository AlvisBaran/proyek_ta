'use client'

import { useEffect, useMemo, useState } from 'react'

import { Backdrop, Box, Button, Chip, Modal, Typography } from '@mui/material'
import Fade from '@mui/material/Fade'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import NotInterestedIcon from '@mui/icons-material/NotInterested'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import MyAxios from '@/hooks/MyAxios'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const page = () => {
  const [dataUser, setDataUser] = useState([])
  const [email, setEmail] = useState('')
  const [idUser, setIdUser] = useState(0)
  const [openBanModal, setOpenBanModal] = useState(false)
  const [isBan, setIsBan] = useState(false)

  const session = useSession()

  const banModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  const handleOpenBanModal = (id, email) => {
    setOpenBanModal(true)
    setEmail(email)
    setIdUser(id)
  }
  const handleCloseBanModal = () => {
    setOpenBanModal(false)
    setEmail('')
    setId(0)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3000/service/admin/user')
      setDataUser(response.data)
    }
    fetchData()
    // console.log(dataUser)
  }, [])

  const dataContent = [
    {
      id: 1,
      role: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      saldo: 0,
      display_name: 'Main Admin',
      profile_picture: null,
      socials: [],
      ban_status: 'clean',
      last_banned: null,
      join_date: '2023-10-13T07:27:27.107Z',
      c_username: 'admin1'
    }
  ]
  const handleBanUser = id => {
    console.log('ban ' + id)
  }
  const handleUnbanUser = id => {
    console.log('unban ' + id)
  }
  const handleChangeRoleUser = id => {
    console.log('change role ' + id)
  }
  const handleChangeEmailUser = id => {
    console.log('change email ' + id)
  }
  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 75,
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
            onClick={
              params.row.banStatus === 'clean' || params.row.banStatus === 'unbanned'
                ? () => handleOpenBanModal(params.id, params.row.email)
                : () => handleUnbanUser(params.id)
            }
            label={params.row.banStatus === 'clean' || params.row.banStatus === 'unbanned' ? 'Ban User' : 'Unban User'}
            showInMenu
          />,
          <GridActionsCellItem
            sx={params.row.role == 'admin' ? { display: 'none' } : {}}
            icon={<SupervisorAccountIcon />}
            onClick={() => handleChangeRoleUser(params.id)}
            label='Change Role User'
            showInMenu
          />,
          <GridActionsCellItem
            sx={params.row.role == 'admin' ? { display: 'none' } : {}}
            icon={<AlternateEmailIcon />}
            onClick={() => handleChangeEmailUser(params.id)}
            label='Change Email User'
            showInMenu
          />
        ]
      }
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 50
    },
    {
      field: 'cUsername',
      headerName: 'Username',
      width: 150
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150
    },
    {
      field: 'displayName',
      headerName: 'Display Name',
      width: 150
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150
    },
    {
      field: 'banStatus',
      headerName: 'Status',
      width: 150
    },
    {
      field: 'saldo',
      headerName: 'Saldo',
      width: 150
    },
    {
      field: 'joinDate',
      headerName: 'Joined At',
      width: 150,
      editable: true
    }
  ]
  const dataBreadcrumb = [
    {
      title: 'Master User',
      url: '/admin/master-user'
    }
  ]
  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Breadcrumb data={dataBreadcrumb} />
      <Typography sx={{ marginBottom: 2 }} variant='h5'>
        Master User
      </Typography>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: 'normal'
          },
          '& .MuiDataGrid-columnHeader': {
            // Forced to use important since overriding inline styles
            height: 'unset !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            // Forced to use important since overriding inline styles
            maxHeight: '168px !important'
          },
          '--DataGrid-overlayHeight': '300px'
        }}
        autoHeight
        rows={dataUser}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        slots={{
          toolbar: GridToolbar
        }}
      />
      <div>
        <Modal
          open={openBanModal}
          onClose={handleCloseBanModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={banModalStyle}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Ban User
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2, mb: 2 }}>
              Are you sure want to ban {email} ?
            </Typography>
            <Button variant='contained' color='success' sx={{ mr: 2 }}>
              Accept
            </Button>
            <Button variant='outlined' color='error'>
              Cancel
            </Button>
          </Box>
        </Modal>
      </div>
    </Box>
  )
}

export default page
