'use client'
import MyAxios from '@/hooks/MyAxios'
import { Box, Button, Divider, FormControl, InputLabel, List, ListItemButton, ListItemText, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MyAlert from '../../components/MyAlert'
import ChatRoom from '../components/ChatRoom'
import Breadcrumb from '../../components/Breadcrumb'

const page = () => {
  const [dataMessage, setDataMessage] = useState([])
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userData, setUserData] = useState([])
  const [selectedUser, setSelectedUser] = useState(-1)
  const [contentNewMessage, setContentNewMessage] = useState("")
  const userId = 2
  const fetch = async() => {
    await MyAxios.get(`/messaging?userId=${userId}`)
    .then(async(ret) => {
      setDataMessage(ret.data)
      console.log(ret.data)
      await MyAxios.get('/admin/user')
      .then(ret2 => {
        setUserData(ret2.data)
      })
    })
    .catch(err => {
      setIsOpenAlert(true)
      setAlertSeverity("error")
      setAlertMessage(err.message)
    })
  }
  useEffect(() => {
    
    fetch()
    const intervalChatList = setInterval(async () => {
      await MyAxios.get(`/messaging?userId=${userId}`)
      .then(ret => {
        setDataMessage(ret.data)
        console.log(ret.data)
      })
      .catch(err => {
        setIsOpenAlert(true)
        setAlertSeverity("error")
        setAlertMessage(err.message)
      })
    }, 5000);
    return () => clearInterval(intervalChatList);
  }, [])

  const handleListItemClick = (
    event,
    index
  ) => {
    setSelectedIndex(index);
  };

  const dataBreadcrumb = [
    {
      title: 'Message',
      url: '/user/message'
    }
  ]

  const handleSendNewMessageButton = () => {
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const handleChangeUserSelect = (e) => {
    console.log(e.target.value)
    setSelectedUser(e.target.value)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: 'black',
    p: 2,
  };

  const handleSendNewMessage = async() => {
    await MyAxios.post(`/messaging`, {userId: userId, user2Id: selectedUser})
    .then(ret => {
      setSelectedUser(-1)
      handleCloseModal()
      fetch()
    })
  }

  return (
    <>
      <MyAlert open={isOpenAlert} setOpen={setIsOpenAlert} severity={alertSeverity} message={alertMessage} />
      <Breadcrumb data={dataBreadcrumb} />
      <Stack direction="row" spacing={2} sx={{maxHeight: '100vh'}}>
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <Button sx={{margin: 2}} variant='contained' onClick={handleSendNewMessageButton}>Send New Message</Button>
          <Modal
            open={isOpenModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography variant='h6'>Start a New Message</Typography>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUser}
                  label="Age"
                  onChange={handleChangeUserSelect}
                  sx={{
                    minWidth: '60px',
                    marginBottom: '10px'
                  }}
                >
                  {
                    userData.map((u) => (
                      <MenuItem value={u.id}>{u.displayName}</MenuItem>
                    ))
                  }
                </Select>
                {/* <TextField
                  id="outlined-multiline-flexible"
                  label="Content"
                  multiline
                  maxRows={4}
                  value={contentNewMessage}
                  onChange={(e) => {setContentNewMessage(e.target.value)}}
                /> */}
              </FormControl>
              <Box sx={{display: 'flex'}}>
                <Button sx={{marginRight: 2}} variant='contained' onClick={handleCloseModal}>Cancel</Button>
                <Button variant='contained' onClick={handleSendNewMessage}>Send</Button>
              </Box>
            </Box>
          </Modal>
          <List 
            component="nav" 
            aria-label="secondary mailbox folder"
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              height: '100vh',
              '& ul': { padding: 0 },
            }}  
          >
            {
              dataMessage.map((m) => (
                <>
                <ListItemButton
                  key={m.id}
                  selected={selectedIndex === m.id}
                  onClick={(event) => handleListItemClick(event, m.id)}
                >
                  <ListItemText primary={m.partnerData.displayName} secondary={!!m.lastChat ? <Typography noWrap={true}>{m.lastChat.authorRef === userId ? "You: "+m.lastChat.content : m.partnerData.displayName+": "+m.lastChat.content}</Typography> : "No Message Yet"} />
                </ListItemButton>
                <Divider />
                </>
              ))
            }
            {/* <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemText primary="Spam" />
            </ListItemButton> */}
          </List>
        </Box>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', maxHeight:'100%'}}>
          <ChatRoom chatId={selectedIndex} />
        </Box>
      </Stack>
    </>
  )
}

export default page