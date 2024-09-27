'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'

import {
  Avatar,
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import Link from 'next/link'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const creatorsDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorSearchBox() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const inputRef = useRef(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [isTyped, setIsTyped] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [creators, setCreators] = useState(creatorsDefaultValues)

  const handleClose = () => setOpenDialog(false)

  useEffect(() => {
    if (openDialog && inputRef.current) {
      setIsTyped(false)
      setSearchTerm('')
      setCreators(creatorsDefaultValues)
      inputRef.current.focus()
    }
  }, [openDialog, inputRef])

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
    if (isTyped && !!searchValue) fetchCreatorData()
  }, [searchValue])

  return (
    <Container maxWidth={upMd ? 'md' : false} sx={{ mx: 'auto', pt: 2 }}>
      <Stack direction='row' gap={2} alignItems='center' onClick={() => setOpenDialog(true)} sx={{ cursor: 'pointer' }}>
        <SearchIcon />
        <Box sx={{ width: '100%', borderBottom: '1px solid black' }}>
          <Typography>Search creator</Typography>
        </Box>
      </Stack>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='md'
        fullWidth
        fullScreen={!upMd}
      >
        <DialogTitle>
          <Stack direction='row' gap={2} alignItems='center'>
            <SearchIcon />
            <TextField
              inputRef={inputRef}
              name='search'
              fullWidth
              size='small'
              variant='standard'
              placeholder='Search creator'
              autoComplete='off'
              value={searchTerm}
              onChange={e => {
                setIsTyped(true)
                setSearchTerm(e.target.value)
              }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ minHeight: '60vh', px: upMd ? 2 : 0 }}>
          {creators.loading ? (
            <LoadingSpinner />
          ) : creators.success ? (
            <List disablePadding>
              {creators.data.map((item, index) => (
                <ListItem key={`search-creator-list-item-${index}`} disablePadding>
                  <ListItemButton LinkComponent={Link} href={`/c/${item.cUsername}`}>
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
            <Typography textAlign='center' variant='body2'>
              Type to search your favorite creators!
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}
