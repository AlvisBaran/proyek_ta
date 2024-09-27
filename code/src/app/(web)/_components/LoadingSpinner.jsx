import { CircularProgress, Stack } from '@mui/material'

export default function LoadingSpinner(props) {
  const { sx } = props

  return (
    <Stack
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ height: '60vh', width: '100%', ...sx }}
    >
      <CircularProgress disableShrink />
    </Stack>
  )
}
