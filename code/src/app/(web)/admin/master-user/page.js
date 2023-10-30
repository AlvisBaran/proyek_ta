"use client";

import { useMemo } from "react";

import { Box, Chip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";

import NotInterestedIcon from '@mui/icons-material/NotInterested';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Breadcrumb from "../../components/Breadcrumb";

const page = () => {

  const dataContent = [
    {
      "id": 1,
      "role": "admin",
      "email": "admin@example.com",
      "password": "password123",
      "saldo": 0,
      "display_name": "Main Admin",
      "profile_picture": null,
      "socials": [],
      "ban_status": "clean",
      "last_banned": null,
      "join_date": "2023-10-13T07:27:27.107Z",
      "c_username": "admin1"
  },
  ]
  const handleBanUser = (id) => {
    console.log('ban '+id);
  }
  const handleUnbanUser = (id) => {
    console.log('unban '+id);
  }
  const handleChangeRoleUser = (id) => {
    console.log('change role '+id);
  }
  const handleChangeEmailUser = (id) => {
    console.log('change email '+id);
  }
  const columns = [
    { 
      field: 'actions', 
      type: 'actions',
      headerName: 'Actions', 
      width: 75,
      getActions: (params) => [
        <GridActionsCellItem icon={params.row.ban_status==="clean" || params.row.ban_status==="unbanned" ? <NotInterestedIcon /> : <CheckCircleOutlineIcon />} onClick={params.row.ban_status==="clean" || params.row.ban_status==="unbanned" ? () => handleBanUser(params.id) : () => handleUnbanUser(params.id)} label={params.row.ban_status==="clean" || params.row.ban_status==="unbanned" ? "Ban User" : "Unban User"} showInMenu/>,
        <GridActionsCellItem icon={<SupervisorAccountIcon />} onClick={() => handleChangeRoleUser(params.id)} label="Change Role User" showInMenu />,
        <GridActionsCellItem icon={<AlternateEmailIcon />} onClick={() => handleChangeEmailUser(params.id)} label="Change Email User" showInMenu />,
      ]
    },
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50 
    },
    {
      field: 'c_username',
      headerName: 'Username',
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
    },
    {
      field: 'display_name',
      headerName: 'Display Name',
      width: 150,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
    },
    {
      field: 'ban_status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'saldo',
      headerName: 'Saldo',
      width: 150,
    },
    {
      field: 'join_date',
      headerName: 'Joined At',
      width: 150,
      editable: true,
    },
  ]
  const dataBreadcrumb = [
    {
      title: "Master User",
      url: "/admin/master-user",
    }
  ]
  return (
    <Box sx={{maxWidth: '100vw'}}>
      <Breadcrumb data={dataBreadcrumb}/>
      <Typography sx={{marginBottom:2}} variant="h5">Master User</Typography>
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal"
          },
          "& .MuiDataGrid-columnHeader": {
            // Forced to use important since overriding inline styles
            height: "unset !important"
          },
          "& .MuiDataGrid-columnHeaders": {
            // Forced to use important since overriding inline styles
            maxHeight: "168px !important"
          },
          '--DataGrid-overlayHeight': '300px'
        }}
        autoHeight
        rows={dataContent}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        slots={{ 
          toolbar: GridToolbar,
         }}
      />
    </Box>
  )
}

export default page