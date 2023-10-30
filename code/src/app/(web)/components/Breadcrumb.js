import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { Box } from '@mui/material';


export default function Breadcrumb({data}) {
  return (
    <Box sx={{marginBottom:2}}>
      <div role="presentation" sx={{marginBottom: 4}}>
        <Breadcrumbs aria-label="breadcrumb">
          {data.map(d => (
            <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href={d.url}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {d.title}
          </Link>
          ))}
        </Breadcrumbs>
      </div>
    </Box>
  );
}