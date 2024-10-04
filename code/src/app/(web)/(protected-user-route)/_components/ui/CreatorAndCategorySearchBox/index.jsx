'use client'

import Link from 'next/link'
import { forwardRef, Fragment, useEffect, useRef, useState } from 'react'

import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Slide,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import Person4Icon from '@mui/icons-material/Person4'
import CategoryIcon from '@mui/icons-material/Category'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const creatorsDefaultValues = { data: [], loading: false, error: false, success: false }
const categoriesDefaultValues = { data: [], loading: false, error: false, success: false }

export default function CreatorAndCategorySearchBox() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const inputRef = useRef(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [isTyped, setIsTyped] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [creators, setCreators] = useState(creatorsDefaultValues)
  const [categories, setCategories] = useState(categoriesDefaultValues)

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

  async function fetchCategoryData() {
    setCategories({ ...categories, loading: true, error: false, success: false })
    await MyAxios.get('/category', {
      params: { keyword: searchValue }
    })
      .then(res => {
        setCategories({ ...categories, data: res.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setCategories({ ...categories, data: [], loading: false, error: true })
      })
  }

  useEffect(() => {
    if (isTyped && !!searchValue) {
      fetchCreatorData()
      fetchCategoryData()
    }
  }, [searchValue])

  return (
    <Container maxWidth={upMd ? 'md' : false} sx={{ mx: 'auto', pt: 2 }}>
      <Stack direction='row' gap={2} alignItems='center' onClick={() => setOpenDialog(true)} sx={{ cursor: 'pointer' }}>
        <SearchIcon />
        <Box sx={{ width: '100%', borderBottom: '1px solid black' }}>
          <Typography>Search creator or categories</Typography>
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
              placeholder='Search creator or categories'
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
          {!!searchValue ? (
            <List disablePadding>
              <ListSubheader>
                <Stack direction='row' alignItems='center' gap={1}>
                  <CategoryIcon fontSize='small' />
                  Categories
                </Stack>
              </ListSubheader>
              {categories.loading ? (
                <ListItem disablePadding>
                  <ListItemAvatar>
                    <Avatar>
                      <CircularProgress />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Searching...' />
                </ListItem>
              ) : categories.success ? (
                <Fragment>
                  {categories.data.map((item, index) => (
                    <ListItem key={`search-category-list-item-${index}`} disablePadding>
                      <ListItemButton LinkComponent={Link} href={`/cat/${item.id}`}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {categories.data.length === 0 ? (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <QuestionMarkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary='Opps!' secondary={`No category goes by '${searchValue}'`} />
                    </ListItem>
                  ) : null}
                </Fragment>
              ) : null}
              <ListSubheader>
                <Stack direction='row' alignItems='center' gap={1}>
                  <Person4Icon fontSize='small' />
                  Creators
                </Stack>
              </ListSubheader>
              {creators.loading ? (
                <ListItem disablePadding>
                  <ListItemAvatar>
                    <Avatar>
                      <CircularProgress />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary='Searching...' />
                </ListItem>
              ) : creators.success ? (
                <Fragment>
                  {creators.data.map((item, index) => (
                    <ListItem key={`search-category-list-item-${index}`} disablePadding>
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
                </Fragment>
              ) : null}
            </List>
          ) : (
            <Typography textAlign='center' variant='body2'>
              Type to search your favorite creators or categories!
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}
