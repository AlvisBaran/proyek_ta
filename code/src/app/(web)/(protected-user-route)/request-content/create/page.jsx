'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField
} from '@mui/material'

import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'

import UserPageLayout from '../../_components/layout'
import PageHeader from '@/app/(web)/_components/PageHeader'
import CreatorSelectorDialog from './_components/CreatorSelectorDialog'
import MyAxios from '@/hooks/MyAxios'

const submitRequestDefaultValues = { loading: false, success: false, error: false }

export default function UserRequestContentCreatePage() {
  const router = useRouter()
  const [openCreatorSelector, setOpenCreatorSelector] = useState(false)
  const [submitRequest, setSubmitRequest] = useState(submitRequestDefaultValues)

  const formHook = useForm({
    defaultValues: {
      creator: null,
      requestNote: ''
    },
    mode: 'onChange'
  })
  const creatorWatcher = formHook.watch('creator')

  async function onSubmit(data) {
    setSubmitRequest({ ...submitRequest, loading: true, error: false, success: false })
    await MyAxios.post('/user/content-request', {
      creatorId: data.creator.id,
      requestNote: data.requestNote
    })
      .then(resp => {
        toast.success('Success submit request!')
        setSubmitRequest({ ...submitRequest, loading: false, success: true })
        router.push('/request-content')
      })
      .catch(err => {
        toast.error(`Error submit request!${err}`)
        setSubmitRequest({ ...submitRequest, loading: false, error: true })
      })
  }

  return (
    <UserPageLayout appbarTitle='Request Content'>
      <Container maxWidth='sm'>
        <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
          <Card elevation={3}>
            <CardHeader title='Content Request' subheader='Request a content to your favorite creator' />
            <CardContent>
              <Stack gap={3}>
                <PageHeader
                  title='Creator'
                  subTitle={!!creatorWatcher ? 'You can re-select creator' : 'Please select a creator'}
                  action={
                    <Button
                      variant='contained'
                      size='small'
                      color='secondary'
                      onClick={() => setOpenCreatorSelector(true)}
                    >
                      {!!creatorWatcher ? 'Re-select' : 'Select'}
                    </Button>
                  }
                />
                {!!creatorWatcher ? (
                  <List dense>
                    <ListItem
                      secondaryAction={
                        <IconButton color='error' onClick={() => formHook.setValue('creator', null)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={creatorWatcher.profilePictureUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={creatorWatcher.displayName} secondary={creatorWatcher.cUsername} />
                    </ListItem>
                  </List>
                ) : null}
                <TextField
                  label='Description Note'
                  placeholder='Tell your creator what do you want it to be?'
                  multiline
                  minRows={4}
                  InputLabelProps={{ shrink: true }}
                  {...formHook.register('requestNote')}
                />
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'end' }}>
              <Button type='submit' variant='contained' disabled={submitRequest.loading} startIcon={<SendIcon />}>
                {submitRequest.loading ? 'Sending...' : 'Send'}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Container>

      <CreatorSelectorDialog
        open={openCreatorSelector}
        onClose={() => setOpenCreatorSelector(false)}
        setCreator={newValue => {
          formHook.setValue('creator', newValue)
          setOpenCreatorSelector(false)
        }}
      />
    </UserPageLayout>
  )
}
