'use client'

import Link from 'next/link'

import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import AdsClickIcon from '@mui/icons-material/AdsClick'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'

import { formatDayMonth } from '@/utils/dayjsConst'
import { intlNumberFormat } from '@/utils/intlNumberFormat'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function ContentCardWithCreator({ content, relativeDate = false, equalHeight = false }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  if (!!content)
    return (
      <Card elevation={3} sx={{ height: equalHeight ? '100%' : undefined }}>
        <CardActionArea
          LinkComponent={Link}
          href={`/contents/${content.id}`}
          sx={{ height: equalHeight ? '100%' : undefined }}
        >
          <CardMedia
            component={content.Gallery[0]?.type === 'video' ? 'video' : 'img'}
            loading='lazy'
            src={content.Gallery[0]?.url}
            title={content.Gallery[0]?.name}
            height={upMd ? 200 : 120}
            onContextMenu={e => e.preventDefault()}
          />
          <CardHeader
            title={content.title}
            subheader={
              relativeDate ? dayjs(content.createdAt).fromNow() : dayjs(content.createdAt).format(formatDayMonth)
            }
            titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
            subheaderTypographyProps={{ variant: 'caption' }}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant='body2' textAlign='justify'>
              {content.description}
            </Typography>
            <Stack direction='row' alignItems='center' gap={2} mt={2}>
              <Stack direction='row' alignItems='center' gap={1}>
                <AdsClickIcon fontSize='11' />
                <Typography variant='caption'>{intlNumberFormat(content.viewCounter, true)}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' gap={1}>
                <FavoriteIcon fontSize='11' />
                <Typography variant='caption'>{intlNumberFormat(content.likeCounter, true)}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' gap={1}>
                <ShareIcon fontSize='11' />
                <Typography variant='caption'>{intlNumberFormat(content.shareCounter, true)}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
        <Divider />
        <CardActionArea LinkComponent={Link} href={`/c/${content.Creator.cUsername}/home`}>
          <CardHeader
            avatar={<Avatar src={content.Creator.profilePictureUrl} />}
            title={content.Creator.displayName}
            subheader={content.Creator.cUsername}
          />
        </CardActionArea>
      </Card>
    )

  return null
}
