'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import CreatorRequestContentLayout, { creatorRequestContentNavs } from '../_components/CreatorRequestContentLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import CustomViewMode from '@/app/(web)/_components/CustomViewMode'

import CreatorRequestContentDetailAction from './_components/CreatorRequestContentDetailAction'
import SetPriceDialog from './_components/SetPriceDialog'
import SetContentDialog from './_components/SetContentDialog'

const activeNav = 'detail'
const contentRequestDefaultValue = { data: null, loading: false, success: false, error: false }
const setStatusDefaultValue = { loading: false, success: false, error: false }
const SET_PRICE_ALLOWED_STATUS = ['requested', 'on-progress', 'waiting-requestor-confirmation']

export default function CreatorRequestContentDetailMainPage({ params }) {
  const id = params.id
  const currNav = creatorRequestContentNavs.find(item => item.value === activeNav)
  const theme = useTheme()
  const { pushConfirm } = useDialog()

  const [contentRequest, setContentRequest] = useState(contentRequestDefaultValue)
  const [setStatus, setSetStatus] = useState(setStatusDefaultValue)
  const [openSetPriceDialog, setOpenSetPriceDialog] = useState(false)
  const [openSetContentDialog, setOpenSetContentDialog] = useState(false)

  // * Fetch Content Request
  async function fetchData() {
    setContentRequest({ ...contentRequest, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/content-request/${id}`)
      .then(resp => {
        setContentRequest({ ...contentRequest, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContentRequest({ ...contentRequest, data: null, loading: false, error: true })
      })
  }

  // * Set Status
  async function updateStatus(mode) {
    // ? mode == "start-progress" | "done-progress" | "confirm-payment"
    setSetStatus({ ...setStatus, loading: true, error: false, success: false })
    await MyAxios.put(`/creator/content-request/${id}/update-status`, { mode })
      .then(resps => {
        toast.success(`Success update status!`)
        setSetStatus({ ...setStatus, loading: false, success: true })
        fetchData()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed update status!\n${err.response.data.message}`)
        setSetStatus({ ...setStatus, loading: false, error: true })
        fetchData()
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <CreatorRequestContentLayout activeNav={activeNav} id={id}>
      {contentRequest.loading ? (
        <LoadingSpinner />
      ) : contentRequest.success && !!contentRequest.data ? (
        <Card elevation={3} sx={{ mt: 2 }}>
          <CardHeader
            title={currNav.label}
            titleTypographyProps={{ variant: 'h6' }}
            subheader={currNav.subTitle}
            subheaderTypographyProps={{ variant: 'body2' }}
            action={
              <CreatorRequestContentDetailAction
                data={contentRequest.data}
                setOpenSetContentDialog={setOpenSetContentDialog}
              />
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Typography fontWeight={600}>Requestor</Typography>
                  <Stack direction='row' gap={2} alignItems='center' sx={{ p: 1 }}>
                    <Avatar src={contentRequest.data?.ContentRequestor?.profilePictureUrl} />
                    <Stack>
                      <Typography>{contentRequest.data?.ContentRequestor?.displayName}</Typography>
                      {!!contentRequest.data?.ContentRequestor?.cUsername ? (
                        <Typography variant='body2' color={theme.palette.grey[600]}>
                          {contentRequest.data?.ContentRequestor?.cUsername}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomViewMode
                  label='Status'
                  valueComponent={
                    <Stack direction='row' alignItems='center' gap={1}>
                      <Chip
                        size='small'
                        label={String(contentRequest.data.status).toUpperCase().replaceAll('-', ' ')}
                        color={
                          contentRequest.data.status === 'done'
                            ? 'success'
                            : contentRequest.data.status === 'waiting-requestor-confirmation' ||
                                contentRequest.data.status === 'waiting-payment'
                              ? 'info'
                              : 'warning'
                        }
                        sx={{ ml: 1 }}
                      />
                      {contentRequest.data.status === 'requested' ? (
                        <Button
                          size='small'
                          variant='outlined'
                          disabled={setStatus.loading}
                          onClick={() =>
                            pushConfirm({
                              title: 'Start Progress?',
                              content:
                                'By start the progress, you are accepting the request and ready to start doing the request!',
                              onAgreeBtnClick: () => updateStatus('start-progress')
                            })
                          }
                        >
                          {setStatus.loading ? 'Updating...' : 'Set to "On Progress"'}
                        </Button>
                      ) : contentRequest.data.status === 'on-progress' && !!contentRequest.data.Content ? (
                        <Button
                          size='small'
                          variant='outlined'
                          disabled={setStatus.loading}
                          onClick={() =>
                            pushConfirm({
                              title: 'Done Progress?',
                              content: 'By claiming done, you are unable to re-set the content again!',
                              onAgreeBtnClick: () => updateStatus('done-progress')
                            })
                          }
                        >
                          {setStatus.loading ? 'Updating...' : 'Set to "Done Progress"'}
                        </Button>
                      ) : contentRequest.data.status === 'waiting-creator-confirmation' ? (
                        <Button
                          size='small'
                          variant='outlined'
                          disabled={setStatus.loading || Number(contentRequest.data.leftoverPrice) !== 0}
                          onClick={() =>
                            pushConfirm({
                              title: 'Confirm Payment?',
                              content:
                                "By confirming client's payments, you are going to withdraw their payment to your account balance and close the request!",
                              onAgreeBtnClick: () => updateStatus('confirm-payment')
                            })
                          }
                        >
                          {setStatus.loading ? 'Updating...' : 'Confirm Payments'}
                        </Button>
                      ) : null}
                    </Stack>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomViewMode
                  label='Price | Unpaid'
                  valueComponent={
                    <Stack direction='row' alignItems='center' gap={1}>
                      {!!contentRequest.data.price ? (
                        <Typography>{`Rp ${intlNumberFormat(contentRequest.data.price)}  | Rp ${intlNumberFormat(contentRequest.data.leftoverPrice, true)}`}</Typography>
                      ) : (
                        <Typography>Not Yet Set</Typography>
                      )}
                      {SET_PRICE_ALLOWED_STATUS.includes(contentRequest.data.status) ? (
                        <Tooltip
                          placement='top-end'
                          title={!!contentRequest.data.price ? 'Re-set Price' : 'Set Price'}
                          onClick={() => setOpenSetPriceDialog(true)}
                        >
                          <IconButton size='small'>
                            <EditIcon fontSize='inherit' />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </Stack>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={600}>Request Note</Typography>
                <Typography textAlign='justify' p={1}>
                  {contentRequest.data.requestNote}
                </Typography>
              </Grid>
              {!!contentRequest.data.contentRef ? (
                <Grid item xs={12}>
                  <Typography fontWeight={600} mb={1}>
                    Content
                  </Typography>
                  <Button
                    LinkComponent={Link}
                    href={`/creator/master-content/${contentRequest.data.contentRef}/edit`}
                    variant='outlined'
                  >
                    Go to content
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      <SetPriceDialog
        contentRequest={contentRequest.data}
        open={openSetPriceDialog}
        onClose={() => setOpenSetPriceDialog(false)}
        onSuccess={fetchData}
      />

      <SetContentDialog
        contentRequest={contentRequest.data}
        open={openSetContentDialog}
        onClose={() => setOpenSetContentDialog(false)}
        onSuccess={fetchData}
      />
    </CreatorRequestContentLayout>
  )
}
