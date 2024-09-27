'use client'

import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import { MuiTheme } from '@/themes/mui/_Theme'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CssBaseline } from '@mui/material'
import { DialogProvider } from '@/hooks/useDialog'

export default function AppWrapper({ children }) {
  return (
    <Fragment>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={MuiTheme}>
          <DialogProvider>{children}</DialogProvider>
        </ThemeProvider>
      </LocalizationProvider>
      <Toaster position='bottom-right' reverseOrder={false} />
    </Fragment>
  )
}
