'use client'

// ** Next & React Imports
import { createContext, useContext, useState, Fragment } from 'react'

// ** MUI Component Imports
import {
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent
} from '@mui/material'

const DialogContext = createContext({})

const defaultDialogProps = {
  open: false,
  title: '',
  content: ''
}

const DialogProvider = props => {
  const { children } = props
  const [dialogProps, setDialogProps] = useState(defaultDialogProps)

  const handleClose = () => {
    setDialogProps({ ...dialogProps, open: false })
  }

  const pushAlert = alertProps => {
    setDialogProps({
      ...alertProps,
      open: true,
      onClose: () => {
        if (!!alertProps.onClose) {
          alertProps.onClose()
          handleClose()
        }
      },
      actionButtons: [
        {
          children: 'OK',
          onClick: () => {
            if (!!alertProps.onAgreeBtnClick) alertProps.onAgreeBtnClick()
            if (!!alertProps.onClose) alertProps.onClose()
            handleClose()
          }
        }
      ]
    })
  }

  const pushConfirm = confirmProps => {
    setDialogProps({
      ...confirmProps,
      open: true,
      onClose: () => {
        if (!!confirmProps.onClose) {
          confirmProps.onClose()
          handleClose()
        }
      },
      actionButtons: confirmProps?.actionButtons
        ? confirmProps?.actionButtons?.map(btnProps => ({
            ...btnProps,
            onClick: () => {
              if (!!btnProps.onClick) btnProps.onClick({})
              handleClose()
            }
          }))
        : undefined,
      onAgreeBtnClick: () => {
        if (!!confirmProps.onAgreeBtnClick) confirmProps.onAgreeBtnClick()
        handleClose()
      },
      onCancelBtnClick: () => {
        if (!!confirmProps.onCancelBtnClick) confirmProps.onCancelBtnClick()
        handleClose()
      }
    })
  }

  const value = {
    setDialogProps,
    pushAlert,
    pushConfirm
  }

  return (
    <DialogContext.Provider value={value} {...props}>
      {dialogProps.open ? (
        <MyConfirmDialog {...dialogProps} open={dialogProps.open ?? false} onClose={handleClose} />
      ) : null}
      {children}
    </DialogContext.Provider>
  )
}

function MyConfirmDialog(props) {
  const { open, onClose, fullWidth = true, maxWidth = 'xs', allowFullScreen } = props
  const { title = 'Title', content = 'Contents...' } = props
  const { agreeBtnText = 'OK', cancelBtnText = 'CANCEL', actionButtons } = props
  const { onAgreeBtnClick, onCancelBtnClick = onClose } = props
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Dialog
      open={open}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      fullScreen={allowFullScreen ? !upMd : false}
      keepMounted={false}
      onClose={onClose}
      aria-describedby='my-confirm-dialog'
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {!!actionButtons && actionButtons.length ? (
          <Fragment>
            {actionButtons?.map((btnProps, index) => (
              <Button key={`my-confirm-dialog-action-button-item-${index}`} {...btnProps} />
            ))}
          </Fragment>
        ) : (
          <Fragment>
            <Button color='error' onClick={onCancelBtnClick}>
              {cancelBtnText}
            </Button>
            <Button onClick={onAgreeBtnClick} autoFocus>
              {agreeBtnText}
            </Button>
          </Fragment>
        )}
      </DialogActions>
    </Dialog>
  )
}

const useDialog = () => useContext(DialogContext)

export { DialogProvider, useDialog }
