'use client';
import MyAxios from '@/hooks/MyAxios';
import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'


import AddIcon from '@mui/icons-material/Add';

const page = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedCreator, setSearchedCreator] = useState([])
  const handleSearchCreator = async() => {
    await MyAxios.get(`/creator/search?keyword=${searchQuery}`)
    .then(ret => {
      setSearchedCreator(ret.data)
    })
  } 
  return (
    <Stack sx={{padding: 2, maxHeight: '100%'}} spacing={2}>
      <Box sx={{display: 'flex'}} gap={2}>
        <TextField sx={{flexGrow: 1}} marginRight={2} id="outlined-basic" label="Search Creator" variant="outlined" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
        <Button variant='contained' onClick={handleSearchCreator}>Search</Button>
      </Box>
      <List 
        component="nav" 
        aria-label="secondary mailbox folder"
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          height: '100vh',
          '& ul': { padding: 2 },
        }}  
      >
        {
          searchedCreator.map((c) => (
            <>
            <ListItem 
              secondaryAction={
              <Button variant={'contained'}>
                <AddIcon /> Follow
              </Button>
            }>
              <ListItemText primary={c.displayName} secondary={c.cUsername} />
            </ListItem>
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
    </Stack>
  )
}

export default page