'use client'

import { Box, Button, Chip, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import { getRowIdFromRowModel } from '@mui/x-data-grid/internals'
import Breadcrumb from '@/app/(web)/components/Breadcrumb'
import ChipGroup from '@/app/(web)/components/ChipGroup'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import MyAxios from '@/hooks/MyAxios'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'

const page = () => {
  const [dataContent, setDataContent] = useState([])
  const fetch = async () => {
    await MyAxios.get('/creator/content?creatorId=5')
      .then(ret => {
        setDataContent(ret.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    fetch()
  }, [])
  const handlePublishKonten = async (id, status) => {
    await MyAxios.put(`/creator/content/${id}/publish_status`, {
      creatorId: 5,
      type: status == 'draft' ? 'publish' : 'unpublish'
    })
      .then(async ret => {
        console.log(ret.data)
        await fetch()
      })
      .catch(err => {
        console.log(err)
      })
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
            icon={params.row.status === 'draft' ? <PublishIcon /> : <UnpublishedIcon />}
            onClick={() => handlePublishKonten(params.id, params.row.status)}
            label={params.row.status === 'draft' ? 'Publish Konten' : 'Draft Konten'}
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
      field: 'title',
      headerName: 'Title',
      width: 150,
      editable: false
    },
    {
      field: 'body',
      headerName: 'Body',
      width: 150,
      editable: false
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
      renderCell: params => {
        const isDraft = params.value === 'draft'
        return <Chip label={params.value} color={isDraft ? 'error' : 'success'} />
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
      field: 'likeCounter',
      headerName: 'Likes',
      width: 150,
      editable: false
    },
    {
      field: 'shareCounter',
      headerName: 'Shares',
      width: 150,
      editable: false
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      editable: false,
      valueFormatter: params => new Date(params.value).toLocaleString()
    }
  ]
  const dataBreadcrumb = [
    {
      title: 'Master Konten',
      url: '/creator/master-content'
    }
  ]
  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Breadcrumb data={dataBreadcrumb} />
      <Link href={'/creator/master-content/create'}>
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
        rows={dataContent}
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
