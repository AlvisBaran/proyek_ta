'use client'

import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'

const creatorsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorSelectorDialog({ open, onClose, setCreator }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

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
    if (!!searchValue) fetchCreatorData()
  }, [searchValue])

  return (
    <Dialog open={open} fullWidth fullScreen={!upMd} maxWidth='sm' onClose={onClose}>
      <DialogTitle>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5'>Select a creator</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
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
                    if (!!setCreator) setCreator(item)
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={item.profilePictureUrl} />
                  </ListItemAvatar>
                  {/* <ListItemText primary={`${item.displayName} • ${item.cUsername}`} secondary={item.bio} /> */}
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
                <ListItemText primary='Opps!' secondary={`No creator goes by '${searchValue}'`} />
              </ListItem>
            ) : null}
          </List>
        ) : (
          <DialogContentText>Type to search your favorite creators!</DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  )
}
