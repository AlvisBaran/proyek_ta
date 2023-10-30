'use client';

import { Box, Chip, Typography } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getRowIdFromRowModel } from '@mui/x-data-grid/internals';
import Breadcrumb from '../../components/Breadcrumb';
import ChipGroup from '../../components/ChipGroup';

const page = () => {
  const dataContent = [
    {
      id: 1,
      title: "title content 1",
      body: "body content 1saffafafasfoasvojsnfovj",
      status: 'Published',
      // categories: <ChipGroup data={[
      //   {
      //     label: "lifestyle" 
      //   },
      //   {
      //     label: "game" 
      //   },
      //   {
      //     label: "membership 1" 
      //   },
      // ]} /> ,
      likes_count: 10,
      shares_count: 5,
      created_at: '10-10-2023',
    }
  ]
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50 
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      editable: true,
    },
    {
      field: 'body',
      headerName: 'Body',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: true,
      renderCell: (params) => {
        const isDraft = params.value === "Draft";
        return <Chip label={params.value} color={isDraft ? "error" : "success"} />;
      }
    },
    // {
    //   field: 'categories',
    //   headerName: 'Categories',
    //   width: 'fit-content',
    //   editable: false,
    //   renderCell: (params) => {
    //     return <ChipGroup data={params.value} color={"success"} />;
    //   }
    // },
    {
      field: 'likes_count',
      headerName: 'Likes',
      width: 150,
      editable: true,
    },
    {
      field: 'shares_count',
      headerName: 'Shares',
      width: 150,
      editable: true,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 150,
      editable: true,
    },
  ]
  const dataBreadcrumb = [
    {
      title: "Master Konten",
      url: "/creator/master-content",
    }
  ]
  return (
    <Box sx={{maxWidth: '100vw'}}>
      <Breadcrumb data={dataBreadcrumb}/>
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