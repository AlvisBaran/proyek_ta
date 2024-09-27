'use client'

import { useEffect, useState } from 'react'

import {
  Avatar,
  Box,
  Card,
  CardActions,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddBoxIcon from '@mui/icons-material/AddBox'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'

import MyAxios from '@/hooks/MyAxios'
import { useDebounce } from '@uidotdev/usehooks'
import { range } from '@/utils/mathHelper'
import UserPageLayout from '../_components/layout'

import AddRoomDialog from './_components/AddRoomDialog'
import ChatRoom from './_components/ChatRoom'

const roomsDefaultValues = { data: [], loading: false, success: false, error: false }

export default function UserMessagePage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [timeTrigger, setTimeTrigger] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = useDebounce(searchTerm, 500)
  const [rooms, setRooms] = useState(roomsDefaultValues)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [openAddRoomDialog, setOpenAddRoomDialog] = useState(false)

  // * Fetch Rooms
  async function fetchRooms() {
    setRooms({ ...rooms, loading: true, success: false, error: false })
    await MyAxios.get(`/user/messaging`)
      .then(resp => {
        setRooms({ ...rooms, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setRooms({ ...rooms, data: [], loading: false, error: true })
      })
  }

  // * Fetch On Interval
  useEffect(() => {
    setTimeout(() => {
      fetchRooms()
      setTimeTrigger(!timeTrigger)
    }, 5000)
  }, [timeTrigger])

  // * Fetch On Change
  useEffect(() => {
    fetchRooms()
  }, [searchValue])

  return (
    <UserPageLayout appbarTitle='Message'>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardActions>
                <TextField
                  fullWidth
                  variant='outlined'
                  size='small'
                  placeholder='Search message room'
                  autoComplete='off'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Tooltip title='Create new room' placement='top-end'>
                  <IconButton onClick={() => setOpenAddRoomDialog(true)}>
                    <AddBoxIcon fontSize='inherit' />
                  </IconButton>
                </Tooltip>
              </CardActions>
              <Divider />
              {rooms.loading ? (
                <Stack gap={1}>
                  {range({ max: 3 }).map(item => (
                    <Stack
                      key={`skeleton-${Math.random()}-${item}`}
                      direction='row'
                      alignItems='center'
                      gap={2}
                      sx={{ px: 2, py: 1 }}
                    >
                      <Skeleton variant='circular' width={40} height={40} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant='text' width='30%' />
                        <Skeleton variant='text' width='70%' />
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              ) : rooms.success ? (
                <List dense sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  {rooms.data?.length <= 0 ? (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <QuestionMarkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary='Oops!' secondary='There are no message yet!' />
                    </ListItem>
                  ) : null}
                  {rooms.data?.map((room, index) => (
                    <RoomChatItem
                      key={`creator-message-room-item-${index}`}
                      room={room}
                      isSelected={!!selectedRoom && room.id === selectedRoom.id}
                      onClick={() => setSelectedRoom(room)}
                    />
                  ))}
                </List>
              ) : null}
            </Card>
          </Grid>
          <ChatRoom
            selectedRoom={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            mode={upMd ? 'grid' : 'dialog'}
            fetchRooms={fetchRooms}
          />
        </Grid>
      </Box>

      <AddRoomDialog
        open={openAddRoomDialog}
        onClose={() => setOpenAddRoomDialog(false)}
        onSuccess={newRoom => {
          fetchRooms()
          setSelectedRoom(newRoom)
        }}
      />
    </UserPageLayout>
  )
}

function RoomChatItem({ room, isSelected, onClick }) {
  const lastChat = !!room.Chats && !!room.Chats[0] ? room.Chats[0].content : '**empty chat**'

  return (
    <ListItemButton selected={isSelected} onClick={onClick}>
      <ListItemAvatar>
        <Avatar src={room.Partner?.profilePictureUrl} />
      </ListItemAvatar>
      <ListItemText primary={room.Partner?.displayName} secondary={lastChat} />
    </ListItemButton>
  )
}
