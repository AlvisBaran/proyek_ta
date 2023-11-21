"use client";

import React from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import Breadcrumb from '@/app/(web)/components/Breadcrumb'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const page = () => {

  const row = [
    {
      id: 1,
      label: "Gaming"
    },
    {
      id: 2,
      label: "Art"
    },
    {
      id: 3,
      label: "Video"
    }
  ]

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50 
    },
    {
      field: 'label',
      flex: 1,
      headerName: 'Label',
      width: 150,
    },
    { 
      field: 'actions', 
      type: 'actions',
      headerName: 'Actions', 
      width: 75,
      getActions: (params) => { 
        return [
          <GridActionsCellItem 
            icon={<EditIcon />} 
            onClick={() => handleEdit(params.id)} 
            label={"Edit"}
          />,
          <GridActionsCellItem 
            icon={<DeleteIcon />} 
            onClick={() => handleDelete(params.id)} 
            label={"Delete"} 
          />,
        ]
      }
    },
  ]

  const handleEdit = (id) => {
    console.log("Edit "+id)
  }

  const handleDelete = (id) => {
    console.log("Delete "+id)
  }

  const dataBreadcrumb = [
    {
      title: "Master Category",
      url: "/admin/master-category",
    }
  ]

  return (
    <Box sx={{maxWidth: '100vw'}}>
      <Breadcrumb data={dataBreadcrumb}/>
      <Typography sx={{marginBottom:2}} variant="h5">Master Category</Typography>
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
        rows={row}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        slots={{ 
          toolbar: GridToolbar,
         }}
      />
    </Box>
  )
}

export default page