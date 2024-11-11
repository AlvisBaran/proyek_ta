'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import MyAxios from '@/hooks/MyAxios'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import { useDebounce } from '@uidotdev/usehooks'

const publishStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'draft-only', label: 'Draft' },
  { value: 'published-only', label: 'Published' }
]

const baseColumns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'title',
    headerName: 'Title'
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'description',
    headerName: 'Description'
  },
  // {
  //   flex: 1,
  //   minWidth: 120,
  //   type: 'custom',
  //   field: 'type',
  //   headerName: 'Type',
  //   align: 'center',
  //   headerAlign: 'center',
  //   renderCell: params => {
  //     return <Chip size='small' label={String(params.value).toUpperCase()} />
  //   }
  // },
  {
    flex: 1,
    minWidth: 120,
    type: 'custom',
    field: 'status',
    headerName: 'Status',
    align: 'center',
    headerAlign: 'center',
    renderCell: params => {
      const isDraft = params.value === 'draft'
      return <Chip size='small' label={String(params.value).toUpperCase()} color={isDraft ? 'error' : 'success'} />
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
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'likeCounter',
    headerName: 'Likes'
  },
  {
    flex: 1,
    minWidth: 120,
    type: 'number',
    field: 'shareCounter',
    headerName: 'Shares'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Created At',
    valueGetter: params => new Date(params.value)
  }
]

const contentsDefaultValues = { data: [], loading: false, error: false, success: false }
const setContentDefaultValues = { loading: false, error: false, success: false }

export default function SetContentDialog({ open, onClose, onSuccess, contentRequest }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [filterPublishStatus, setFilterPublishStatus] = useState('all')
  const [contents, setContents] = useState(contentsDefaultValues)
  const [setContent, setSetContent] = useState(setContentDefaultValues)

  // * Fetch Contents
  async function fetchData() {
    setContents({ ...contents, loading: true, error: false, success: false })
    await MyAxios.get('/creator/content', {
      params: {
        keyword: searchValue,
        filterPublishStatus: filterPublishStatus === 'all' ? undefined : filterPublishStatus
      }
    })
      .then(resp => {
        setContents({ ...contents, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContents({ ...contents, data: [], loading: false, error: true })
      })
  }

  // * Set Content
  async function handleSetContent(contentId) {
    setSetContent({ ...setContent, loading: true, error: false, success: false })
    await MyAxios.put(`/creator/content-request/${contentRequest.id}/set-content`, { contentId })
      .then(resp => {
        toast.success('Success set content!')
        setSetContent({ ...setContent, loading: false, success: true })
        if (!!onSuccess) onSuccess()
        handleClose()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error set content!\n${err.response.data.message}`)
        setSetContent({ ...setContent, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (open) fetchData()
  }, [open, searchValue, filterPublishStatus])

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
  }

  // * Grid Actions
  const columns = [
    {
      width: 120,
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: params => {
        return [
          <GridActionsCellItem
            icon={<CheckCircleOutlineIcon />}
            onClick={() => handleSetContent(params.row.id)}
            // onClick={() =>
            //   pushConfirm({
            //     title: 'Delete Content?',
            //     content: 'Are you sure you want to delete?',
            //     onAgreeBtnClick: () => handleDelete(params.row.id)
            //   })
            // }
            label={'Select'}
          />
        ]
      }
    },
    ...baseColumns
  ]

  return (
    <Dialog maxWidth='lg' fullWidth fullScreen={!upMd} open={open} onClose={handleClose}>
      <DialogTitle>Select Content</DialogTitle>
      <DialogActions>
        <FormControl size='small' sx={{ minWidth: 160 }}>
          <InputLabel id='creator-request-content-detail-set-content-dialog-filter-publish-status-filter-label'>
            Status
          </InputLabel>
          <Select
            labelId='creator-request-content-detail-set-content-dialog-filter-publish-status-filter-label'
            id='creator-request-content-detail-set-content-dialog-filter-publish-status-filter'
            label='Status'
            value={filterPublishStatus}
            onChange={e => setFilterPublishStatus(e.target.value)}
          >
            {publishStatusOptions.map((item, index) => (
              <MenuItem
                key={`creator-request-content-detail-set-content-dialog-filter-publish-status-filter-item-${index}`}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size='small'
          placeholder='Search Content'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </DialogActions>
      <DialogContent>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={contents.data}
          loading={contents.loading || setContent.loading}
        />
      </DialogContent>
    </Dialog>
  )
}
