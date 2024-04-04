'use client'

import { Fragment } from 'react'
import { MuiTheme } from '@/themes/mui/_Theme'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CssBaseline } from '@mui/material'

export default function AppWrapper({ children }) {
  return (
    <Fragment>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={MuiTheme}>{children}</ThemeProvider>
      </LocalizationProvider>
    </Fragment>
  )
}
