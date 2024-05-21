'use client'
import MyAxios from '@/hooks/MyAxios'
import { Avatar, Box, Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const ChatRoom = ({chatId}) => {
  const userId = 2
  const [chatData, setChatData] = useState([])
  const [message, setMessage] = useState('')
  const fetch = async() => {
    if(chatId > -1){
      await MyAxios.get(`/messaging/${chatId}?userId=${userId}&withChats=1`)
      .then(ret => {
        setChatData(ret.data)
        console.log(ret.data)
      })
      .catch(err => {
        // setIsOpenAlert(true)
        // setAlertSeverity("error")
        // setAlertMessage(err.message)
        console.log(err)
      })
    }
  }
  useEffect(() => {
    
    fetch()
    const intervalChatRoom = setInterval(async () => {
      if(chatId > -1){
        await MyAxios.get(`/messaging/${chatId}?userId=${userId}&withChats=1`)
        .then(ret => {
          setChatData(ret.data)
          console.log(ret.data)
        })
        .catch(err => {
          // setIsOpenAlert(true)
          // setAlertSeverity("error")
          // setAlertMessage(err.message)
        })
      }
    }, 5000);
    return () => clearInterval(intervalChatRoom);
  }, [chatId])
  const onClickSendMessageButton = async() => {
    await MyAxios.put(`/messaging/${chatId}?userId=${userId}`, {content: message})
    .then(ret => {
      fetch()
      setMessage('')
    })

  }
  return (
    <div>
    {
      chatId > -1 ?
      (
      <Stack direction="column" spacing={2}  maxHeight={'100vh'} divider={<Divider orientation="horizontal" flexItem />}>
        <Stack direction="row" padding={2} paddingBottom={0} alignItems='center' spacing={2}>
          <Avatar
            alt={chatData?.partnerData?.displayName}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant='h6'>
            {chatData?.partnerData?.displayName}
          </Typography>
        </Stack>
        <Box
        sx={{
          overflow: 'auto',
          
        }}
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            spacing={2}
            padding={2}
            maxHeight={'70%'}
            sx={{
              flexGrow: 1
            }}
          >
            <Grid item xs={12} sx={{flexGrow:1}}>
            {
              chatData?.chats?.map((c) => (
                  <Grid container  marginBottom={2} justifyContent={c.authorRef == userId ? "flex-end" : "flex-start"}>
                    <Box
                      sx={{
                        maxWidth: '75%',
                        bgcolor: 'white',
                        justifyContent: 'flex-end'
                      }}
                      padding={2}
                      textAlign={c.authorRef == userId ? "right" : "left"}
                    >
                      {c.content}
                    </Box>
                  </Grid>
              ))
            }
            </Grid>
            {/* <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container xs={12} marginBottom={2} justifyContent="flex-start">
              <Box
                sx={{
                  maxWidth: '75%',
                  bgcolor: 'white',
                  justifyContent: 'flex-end'
                }}
                padding={2}
                textAlign="left"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet deleniti non consequatur qui fugiat harum laboriosam sequi in ducimus, velit debitis omnis cupiditate excepturi quas adipisci aliquam iure? Labore impedit saepe maxime quas dolores quam dolorem omnis placeat obcaecati laborum nihil modi voluptas fugiat, consequatur ab, aperiam dignissimos doloribus aliquam.
              </Box>
              </Grid>
            </Grid> */}
            
            
            
          </Grid>
        </Box>
        <Box
          sx={{
            display:'flex',
            spacing: 2
          }}
          padding={2}
        >
          <TextField
            required
            id="outlined-required"
            label="Send Message"
            sx={{
              flexGrow:1
            }}
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
          />
          <Button onClick={onClickSendMessageButton}>
            Send
          </Button>
        </Box>
      </Stack>
      )
      :
      (
        <Stack direction="row" sx={{height: '100%'}} alignItems='center' justifyContent="center" spacing={2} >
          <Typography variant='h5'>Please Choose a Chat Room</Typography>
        </Stack>
      )
      
    }
    </div>
  )
}

export default ChatRoom