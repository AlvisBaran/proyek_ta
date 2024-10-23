'use client'

import { useEffect, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'

import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CloseIcon from '@mui/icons-material/Close'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'

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
  // {
  //   flex: 1,
  //   minWidth: 160,
  //   type: 'custom',
  //   align: 'center',
  //   headerAlign: 'center',
  //   field: 'role',
  //   headerName: 'Role',
  //   renderCell: params => {
  //     return (
  //       <Chip
  //         size='small'
  //         label={params.value === 'normal' ? 'MEMBER' : String(params.value).toUpperCase().replaceAll('-', ' ')}
  //         color={
  //           params.value === 'admin'
  //             ? 'error'
  //             : params.value === 'normal'
  //               ? 'primary'
  //               : params.value === 'creator'
  //                 ? 'warning'
  //                 : 'default'
  //         }
  //       />
  //     )
  //   }
  // },
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
  }
  // {
  //   flex: 1,
  //   minWidth: 180,
  //   type: 'dateTime',
  //   field: 'joinDate',
  //   headerName: 'Joined At',
  //   valueGetter: params => new Date(params.value)
  // }
]

const creatorsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorSelector({ selectedCreator, setSelectedCreator }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [creators, setCreators] = useState(creatorsDefaultValues)

  // * Fetch Data
  async function fetchCreatorData() {
    setCreators({ ...creators, loading: true, error: false, success: false })
    await MyAxios.get('/feeds/search-creator', {
      params: {
        keyword: searchValue,
        page: 1,
        perPage: 99
      }
    })
      .then(res => {
        setCreators({ ...creators, data: res.data.rows, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCreators({ ...creators, data: [], loading: false, error: true })
      })
  }

  useEffect(() => {
    if (openDialog) fetchCreatorData()
  }, [searchValue, openDialog])

  function handleCloseDialog() {
    setOpenDialog(false)
  }

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
            color='success'
            icon={<TaskAltIcon />}
            onClick={() => {
              if (!!setSelectedCreator) setSelectedCreator(params.row)
              handleCloseDialog()
            }}
            label={'Select Creator'}
          />
        ]
      }
    }
  ]

  return (
    <Box>
      {!!selectedCreator ? (
        <Alert severity='info' onClose={() => setSelectedCreator(null)}>
          {selectedCreator.displayName} ({selectedCreator.cUsername})
        </Alert>
      ) : (
        <Button variant='contained' size='large' startIcon={<TaskAltIcon />} onClick={() => setOpenDialog(true)}>
          Select Creator
        </Button>
      )}
      <Dialog open={openDialog} fullWidth fullScreen={!upMd} maxWidth='md'>
        <DialogTitle>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Typography variant='h5' sx={{ flexGrow: 1 }}>
              Select a creator
            </Typography>
            <TextField
              size='small'
              placeholder='Search Users'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DataGrid
          {...MUIDataGridDefaults}
          columns={columns}
          rows={creators.data}
          loading={creators.loading}
          slots={{
            toolbar: GridToolbar
          }}
        />
        {/* <DialogContent>
          <Box py={1}>
            <TextField
              fullWidth
              size='small'
              label='Search Username'
              autoComplete='off'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Box>
          {creators.loading ? (
            <LoadingSpinner />
          ) : creators.success ? (
            <List disablePadding>
              {creators.data.map((item, index) => (
                <ListItem key={`request-content-create-search-creator-list-item-${index}`} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (!!setSelectedCreator) setSelectedCreator(item)
                      handleCloseDialog()
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={item.profilePictureUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={item.displayName} secondary={item.bio} />
                  </ListItemButton>
                </ListItem>
              ))}
              {creators.data.length === 0 ? (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <QuestionMarkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Oops!' secondary={`No creator goes by '${searchValue}'`} />
                </ListItem>
              ) : null}
            </List>
          ) : (
            <DialogContentText>Type to search creators!</DialogContentText>
          )}
        </DialogContent> */}
      </Dialog>
    </Box>
  )
}
