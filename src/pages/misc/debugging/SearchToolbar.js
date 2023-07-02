// ** MUI Imports
import { Box, MenuItem } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { GridToolbarColumnsButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useState } from 'react'

const SearchToolbar = props => {
  const pageSizeOptions = [10, 25, 50, 100] // Available rows per page options
  const initialPageSize = pageSizeOptions[0] // Initial rows per page
  const [page, setPage] = useState(0) // Current page number
  const [pageSize, setPageSize] = useState(initialPageSize) // Rows per page
  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize)
    setPage(0)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <CustomTextField select defaultValue=''>
          <MenuItem value={10} onClick={() => handlePageSizeChange(10)}>
            10
          </MenuItem>
          <MenuItem value={25} onClick={() => handlePageSizeChange(25)}>
            25
          </MenuItem>
          <MenuItem value={50} onClick={() => handlePageSizeChange(50)}>
            50
          </MenuItem>
          <MenuItem value={100} onClick={() => handlePageSizeChange(100)}>
            100
          </MenuItem>
        </CustomTextField>
      </Box>
      <Box>
        <CustomTextField
          value={props.value}
          placeholder='Search…'
          onChange={props.onChange}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default SearchToolbar
