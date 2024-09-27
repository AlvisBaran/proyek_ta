// ** Next & React Imports
import { Fragment } from 'react'

// ** MUI Component Imports
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function CustomViewMode({
  label,
  value,
  valueComponent,
  valueSx,
  values,
  getValueLabel = item => String(item),
  getValueComponent,
  valuesAttr
}) {
  return (
    <Stack spacing={0} sx={{ maxWidth: 'max-content' }}>
      <Typography variant='body2' color='dimgray'>
        {label}
      </Typography>
      {!!valueComponent ? (
        valueComponent
      ) : !!values ? (
        <Fragment>
          {values.length <= 0 ? <Typography sx={{ pl: 1 }}>{'-'}</Typography> : null}
          {values.map((item, index) => (
            <Fragment key={`custom-view-mode-generic${Math.random()}-item-${index}`}>
              {!!getValueComponent ? (
                getValueComponent(item)
              ) : (
                <Typography sx={{ pl: 1, ...valueSx }}>
                  {valuesAttr?.prefix}
                  {getValueLabel(item)}
                  {valuesAttr?.suffix}
                </Typography>
              )}
            </Fragment>
          ))}
        </Fragment>
      ) : (
        <Typography sx={{ pl: 1, ...valueSx }}>
          {!!value && value.trim && value.trim().length > 0 ? value : 'Not Set'}
        </Typography>
      )}
    </Stack>
  )
}
