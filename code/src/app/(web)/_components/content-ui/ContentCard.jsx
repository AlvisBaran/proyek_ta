'use client'

import Link from 'next/link'

import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'

import { formatDayMonth } from '@/utils/dayjsConst'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function ContentCard({ content, relativeDate = false }) {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))

  if (!!content)
    return (
      <Card elevation={3}>
        <CardActionArea LinkComponent={Link} href={`/contents/${content.id}`}>
          <CardMedia
            component='img'
            loading='lazy'
            src={content.Gallery[0]?.url}
            alt={content.Gallery[0]?.alt}
            title={content.Gallery[0]?.title}
            height={upMd ? 200 : 120}
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
                <FavoriteIcon fontSize='11' />
                <Typography variant='caption'>{content.likeCounter}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center' gap={1}>
                <ShareIcon fontSize='11' />
                <Typography variant='caption'>{content.shareCounter}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    )

  return null
}
