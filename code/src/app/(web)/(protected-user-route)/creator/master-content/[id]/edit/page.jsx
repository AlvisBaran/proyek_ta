'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertTitle, Stack } from '@mui/material'

import MyAxios from '@/hooks/MyAxios'
import Breadcrumb from '@/app/(web)/_components/Breadcrumb'
import CreatorPageLayout from '../../../_components/layout'

import CategorySection from './_components/CategorySection'
import DetailSection from './_components/DetailSection'
import MembershipSection from './_components/MembershipSection'
import CommentsAndRepliesSection from './_components/CommentsAndRepliesSection'
import GallerySection from './_components/GallerySection'

const contentDefaultValues = { data: null, loading: false, success: false, error: false }

export default function CraetorMasterContentEditPage({ params }) {
  const id = params.id
  const router = useRouter()
  const [content, setContent] = useState(contentDefaultValues)
  const contentRequest =
    !!content.data && !!content.data.ContentRequests && !!content.data.ContentRequests[0]
      ? content.data.ContentRequests[0]
      : null
  const disableEdit = !!contentRequest && contentRequest.status === 'done'

  // * Fetch Data
  async function fetchContent() {
    setContent({ ...content, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/content/${id}`)
      .then(resp => {
        setContent({ ...content, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setContent({ ...content, data: null, loading: false, error: true })
        router.replace('/creator/master-content')
      })
  }

  // * On Load
  useEffect(() => {
    if (!!id) fetchContent()
  }, [])

  return (
    <CreatorPageLayout appbarTitle='Edit Content'>
      <Breadcrumb
        data={[
          {
            title: 'Master Content',
            url: '/creator/master-content'
          },
          {
            title: 'Edit Content',
            url: `/creator/master-content/${id}/edit`
          }
        ]}
      />
      <Stack gap={2}>
        {disableEdit ? (
          <Alert severity='info'>
            <AlertTitle>Attention!</AlertTitle>
            This content is setted as requested content by User and set to done. This will cause you won't be able to
            edit this content anymore!
          </Alert>
        ) : null}
        <DetailSection content={content} fetchContent={fetchContent} />
        <GallerySection content={content} fetchContent={fetchContent} />
        <CategorySection content={content} fetchContent={fetchContent} />
        <MembershipSection content={content} fetchContent={fetchContent} />
        <CommentsAndRepliesSection content={content} />
      </Stack>
    </CreatorPageLayout>
  )
}
