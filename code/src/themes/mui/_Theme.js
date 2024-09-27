'use client'

import { createTheme } from '@mui/material/styles'
import { idID } from '@mui/material/locale'

import { myPalettes } from '../Palettes'

export const MuiTheme = createTheme(
  {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
            // fontSize: 16,
            // fontWeight: 500,
            // background: 'linear-gradient(90deg, #FF8329 11.75%, #D0428C 51.5%, #A200EE 91.26%)'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          }
        }
      }
      // MuiTextField: {
      //   styleOverrides: {
      //     root: {}
      //   }
      // }
    },
    palette: {
      background: {
        // default: myPalettes.coolDeep1.contrast,
        paper: myPalettes.coolDeep1.contrast
      },
      // mode: 'dark',
      primary: {
        main: myPalettes.coolDeep1.primary,
        // main: "#000",
        // light: "#c1d5e0",
        // dark: "#62757f",
        contrastText: myPalettes.coolDeep1.contrast
      },
      secondary: {
        main: myPalettes.coolDeep1.shades,
        // main: '#e0e0e0',
        // light: "#ffffff",
        // dark: "#aeaeae",
        contrastText: myPalettes.coolDeep1.contrast
      },
      ocean: {
        main: myPalettes.ocean1.normal
      }
      // tint: { ...colors },
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily: "'Work Sans', 'Roboto','Helvetica','Arial',sans-serif"
    }
  },
  idID
)
