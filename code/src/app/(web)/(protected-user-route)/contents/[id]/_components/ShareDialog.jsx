'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import LinkIcon from '@mui/icons-material/Link'

import MyAxios from '@/hooks/MyAxios'

const shareLinkDefaultValues = { data: '', loading: false, error: false, success: false, errorText: undefined }

export default function ShareDialog({ contentId, open, onClose }) {
  const [shareLink, setShareLink] = useState(shareLinkDefaultValues)

  // * Fetch Share Link
  async function fetchShareLink() {
    setShareLink({
      ...shareLink,
      data: 'Generating share link...',
      loading: true,
      success: false,
      error: false,
      errorText: undefined
    })
    await MyAxios.get(`/user/content/${contentId}/share`)
      .then(resp => {
        setShareLink({ ...shareLink, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed retrieving Share Link!\n${err.response.data.message}`)
        setShareLink({ ...shareLink, data: '', loading: false, error: true, errorText: err.response.data.message })
      })
  }

  // * On Close
  function handleClose() {
    if (!!onClose) onClose()
  }

  // * On Load
  useEffect(() => {
    if (!!contentId && open) fetchShareLink()
  }, [contentId, open])

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between' gap={2}>
          <Typography variant='h6'>Share Content 😉</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <TextField
          fullWidth
          value={shareLink.data}
          disabled={shareLink.loading}
          error={shareLink.error}
          helperText={!!shareLink.error ? shareLink.errorText : undefined}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ pt: 1 }}>
        <Button
          startIcon={<LinkIcon />}
          disabled={shareLink.loading}
          onClick={() => {
            if (!!navigator) {
              navigator.clipboard.writeText(shareLink.data)
              toast.success('Link copied!')
            }
          }}
        >
          Copy Link
        </Button>
      </DialogActions>
    </Dialog>
  )
}
