import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function PageHeader({title,subtitle,actions=[]}) {
  return (
      <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}

      >
      <Box>
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: 700,
            color: "black",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 16, color: "primary.light" }}>
          {subtitle}
        </Typography>
          </Box>
          <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'end'}
              gap={1}
          >
              {actions.map((action, index) => {
                  return <Button key={action} variant={action.variant} size='medium' onClick={action.value} startIcon={<action.Icon/>}>
                      {action.name}
                  </Button>
              })}
          </Box>
    </Box>
  );
}
