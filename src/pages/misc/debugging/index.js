import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
// ** MUI Imports
import { DataGrid } from '@mui/x-data-grid'
import { Button, Card, CardHeader, Box, MenuItem, Typography } from '@mui/material'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomSearch from 'src/views/table/CustomSearch'

const pageSizeOptions = [5, 10, 25, 50, 100] // Available rows per page options
const initialPageSize = pageSizeOptions[0] // Initial rows per page

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    filterable: false
  },
  {
    flex: 0.09,
    field: 'name',
    minWidth: 290,
    headerName: 'Name',
    renderCell: params => <Typography variant='body2'>{params.row.name}</Typography>
  },
  {
    flex: 0.09,
    field: 'city',
    minWidth: 290,
    headerName: 'City',
    renderCell: params => <Typography variant='body2'>{params.row.city}</Typography>
  },
  {
    flex: 0.09,
    field: 'email',
    minWidth: 290,
    headerName: 'Email',
    renderCell: params => <Typography variant='body2'>{params.row.email}</Typography>
  }
]

const Debugging = () => {
  const [page, setPage] = useState(0) // Current page number
  const [totalRows, setTotalRows] = useState(0) // Total number of rows
  const [rows, setRows] = useState([]) // Rows to be displayed
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(initialPageSize) // Rows per page
  const [filteredData, setFilteredData] = useState([])

  const fetchRows = async () => {
    const offset = page * pageSize

    try {
      const { data, count } = await supabase
        .from('debugs')
        .select('*', { count: 'exact' })
        .ilike('name', `%${searchQuery}%`)
        .order('id', { ascending: true })
        .range(offset, offset + pageSize - 1)

      setRows(data)
      setTotalRows(count)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSearch = searchValue => {
    setSearchQuery(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = rows.filter(row => {
      return Object.keys(row).some(field => {
        return searchRegex.test(row[field].toString())
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize)
    setPage(0)
  }

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1)
    }
  }

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalRows / pageSize) - 1
    if (page < maxPage) {
      setPage(prevPage => prevPage + 1)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [page, pageSize, searchQuery])

  return (
    <Card>
      <CardHeader title='Debugging' />
      <Box sx={{ height: 525 }}>
        <DataGrid
          density='comfortable'
          disableRowCount={true}
          hideFooterPagination={true}
          columns={columns}
          rows={rows}
          slots={{
            toolbar: CustomSearch
          }}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'outlined'
            },
            toolbar: {
              value: searchQuery,
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            }
          }}
        />
      </Box>
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
          <Typography>Rows per page :</Typography>
          <CustomTextField select defaultValue={5} label=''>
            <MenuItem value={5} onClick={() => handlePageSizeChange(5)}>
              5
            </MenuItem>
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
          <Button onClick={handlePrevPage} disabled={page === 0}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={page === Math.ceil(totalRows / pageSize) - 1}>
            Next
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default Debugging
