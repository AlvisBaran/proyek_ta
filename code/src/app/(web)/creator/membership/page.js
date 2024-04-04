'use client'

import { Box, Button, Chip, Typography } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { getRowIdFromRowModel } from '@mui/x-data-grid/internals'
import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import ChipGroup from '@/app/(web)/components/ChipGroup'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MyAxios from '@/hooks/MyAxios'

const page = () => {
  const [dataMembership, setDataMembership] = useState([])
  useEffect(() => {
    const fetch = async () => {
      await MyAxios.get('/creator/membership?creatorId=5')
        .then(ret => {
          console.log(ret.data)
          setDataMembership(ret.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    fetch()
  }, [])
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 50
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: false
    },
    {
      field: 'slug',
      headerName: 'Slug',
      width: 150,
      editable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      editable: false
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      editable: false
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      editable: false,
      valueFormatter: params => new Date(params.value).toLocaleString()
    }
  ]
  const dataBreadcrumb = [
    {
      title: 'Master Membership',
      url: '/creator/membership'
    }
  ]
  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Breadcrumb data={dataBreadcrumb} />
      <Link href={'/creator/membership/create'}>
        <Button sx={{ mb: 2 }} variant='contained'>
          Create
        </Button>
      </Link>
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
        rows={dataMembership}
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
    </Box>
  )
}

export default page
