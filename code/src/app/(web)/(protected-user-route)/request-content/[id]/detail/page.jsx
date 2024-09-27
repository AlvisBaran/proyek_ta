'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Typography
} from '@mui/material'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import { getUserFromComposedSession } from '@/backend/utils/nextAuthUserSessionHelper'
import UserPageLayout from '@/app/(web)/(protected-user-route)/_components/layout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import CustomViewMode from '@/app/(web)/_components/CustomViewMode'

const contentRequestDefaultValues = { data: null, loading: false, success: false, error: false }
const confirmDoneDefaultValues = { loading: false, success: false, error: false }

export const dynamic = 'force-dynamic'

export default function UserRequestContentDetailPage({ params }) {
  const contentRequestId = params.id
  const router = useRouter()
  const session = useSession()
  const user = getUserFromComposedSession(session.data)
  const { pushConfirm } = useDialog()
  const [contentRequest, setContentRequest] = useState(contentRequestDefaultValues)
  const [confirmDone, setConfirmDone] = useState(confirmDoneDefaultValues)

  // * Fetch Data
  async function fetchContentRequest() {
    setContentRequest({ ...contentRequest, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${contentRequestId}`)
      .then(resp => {
        setContentRequest({ ...contentRequest, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContentRequest({ ...contentRequest, data: null, loading: false, error: true })
        router.replace('/request-content')
      })
  }

  // * On Load
  useEffect(() => {
    if (!!contentRequestId) fetchContentRequest()
  }, [contentRequestId])

  // * Confirm Done
  async function updateConfirmDone() {
    setConfirmDone({ ...confirmDone, loading: true, error: false, success: false })
    await MyAxios.put(`/user/content-request/${contentRequestId}`)
      .then(resp => {
        toast.success('Success confirmation!')
        setConfirmDone({ ...confirmDone, loading: false, success: true })
        fetchContentRequest()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Error confirmation!\n${err.response.data.message}`)
        setConfirmDone({ ...confirmDone, loading: false, error: true })
      })
  }

  return (
    <UserPageLayout appbarTitle='Content Request'>
      {contentRequest.loading ? (
        <LoadingSpinner />
      ) : contentRequest.success && !!contentRequest.data ? (
        <Container maxWidth='md'>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={600} mb={1}>
                  Requested To:
                </Typography>
                <Card elevation={3}>
                  <CardActionArea LinkComponent={Link} href={`/c/${contentRequest.data?.ContentCreator?.cUsername}`}>
                    <CardHeader
                      avatar={<Avatar src={contentRequest.data?.ContentCreator?.profilePictureUrl} />}
                      title={contentRequest.data?.ContentCreator?.displayName}
                      subheader={contentRequest.data?.ContentCreator?.cUsername}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={600} mb={1}>
                  Requested By:
                </Typography>
                <Card elevation={3}>
                  <CardActionArea
                    LinkComponent={!!contentRequest.data?.ContentRequestor?.cUsername ? Link : undefined}
                    href={
                      !!contentRequest.data?.ContentRequestor?.cUsername
                        ? `/c/${contentRequest.data?.ContentRequestor?.cUsername}`
                        : undefined
                    }
                  >
                    <CardHeader
                      avatar={<Avatar src={contentRequest.data?.ContentRequestor?.profilePictureUrl} />}
                      title={contentRequest.data?.ContentRequestor?.displayName}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography fontWeight={600} mb={1}>
                      Request Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomViewMode
                          label='Status'
                          valueComponent={
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
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomViewMode
                          label='Price | Unpaid'
                          value={
                            !!contentRequest.data.price
                              ? `Rp ${intlNumberFormat(contentRequest.data.price)} | Rp ${intlNumberFormat(contentRequest.data.leftoverPrice, true)}`
                              : 'Not Yet Set by Creator'
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomViewMode
                          label='Members'
                          valueComponent={
                            <Button
                              LinkComponent={Link}
                              href={`/request-content/${contentRequestId}/detail/members`}
                              size='small'
                              variant='outlined'
                              sx={{ ml: 1 }}
                            >{`View ${intlNumberFormat(contentRequest.data?.ContentRequestMembers?.length, true)} member(s)`}</Button>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomViewMode
                          label='Payments'
                          valueComponent={
                            <Button
                              LinkComponent={Link}
                              href={`/request-content/${contentRequestId}/detail/payments`}
                              size='small'
                              variant='outlined'
                              sx={{ ml: 1 }}
                            >{`View ${intlNumberFormat(contentRequest.data?.ContentRequestPayments?.length, true)} payment(s)`}</Button>
                          }
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  {contentRequest.data.status === 'waiting-requestor-confirmation' &&
                  !!user &&
                  contentRequest.data.applicantRef === user.id ? (
                    <Fragment>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'end' }}>
                        <Button
                          variant='contained'
                          color='success'
                          startIcon={<CheckCircleIcon />}
                          disabled={confirmDone.loading}
                          onClick={() =>
                            pushConfirm({
                              title: 'Confirm Content?',
                              content:
                                'Are you sure the content really fits your expectations and sure to set to done?',
                              onAgreeBtnClick: updateConfirmDone
                            })
                          }
                        >
                          {confirmDone.loading ? 'Loading...' : 'Confirm Content'}
                        </Button>
                      </CardActions>
                    </Fragment>
                  ) : null}
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography fontWeight={600} mb={1}>
                      Request Note
                    </Typography>
                    <Typography>{contentRequest.data.requestNote}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {!!contentRequest.data.Content ? (
                <Grid item xs={12}>
                  Content Preview nya
                </Grid>
              ) : null}
            </Grid>
          </Box>
        </Container>
      ) : null}
    </UserPageLayout>
  )
}
