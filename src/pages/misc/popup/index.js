import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
// ** MUI Imports
import {
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Card,
  TextField,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions,
  Button,
  MenuItem
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomSearch from 'src/views/table/CustomSearch'

const pageSizeOptions = [5, 10, 25, 50, 100] // Available rows per page options
const initialPageSize = pageSizeOptions[0] // Initial rows per page

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const Popup = () => {
  const [page, setPage] = useState(0) // Current page number
  const [pageSize, setPageSize] = useState(initialPageSize) // Rows per page
  const [totalRowsAddress, setTotalRowsAddress] = useState(0) // Total number of rows
  const [inputValue1, setInputValue1] = useState('')
  const [inputStateValue, setInputStateValue] = useState('')
  const [inputValue2, setInputValue2] = useState('')
  const [isDialogOpen1, setIsDialogOpen1] = useState(false)
  const [isDialogOpen2, setIsDialogOpen2] = useState(false)
  const [gridData1, setGridData1] = useState([])
  const [gridData2, setGridData2] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [searchAddressQuery, setSearchAddressQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const handleInputChange1 = event => {
    setInputValue1(event.target.value)
  }

  const handleInputChange2 = event => {
    setInputValue2(event.target.value)
  }

  const openDialog1 = () => {
    setIsDialogOpen1(true)
  }

  const openDialog2 = () => {
    setIsDialogOpen2(true)
  }

  const closeDialog1 = () => {
    setIsDialogOpen1(false)
  }

  const closeDialog2 = () => {
    setIsDialogOpen2(false)
  }

  const handleDialogSubmit1 = () => {
    if (selectedData) {
      setInputValue1(selectedData.full_address)
      setInputStateValue(selectedData.state)
      closeDialog1()
    }
  }

  const handleDialogSubmit2 = () => {
    if (selectedData) {
      setInputValue2(selectedData.post_code)
      closeDialog2()
    }
  }

  const handleSearchAddress = searchValue => {
    setSearchAddressQuery(searchValue)
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

  // FetchingAddress
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const { data, error } = await supabase.from('address').select('*')
        if (error) throw error
        setGridData1(data)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData1()
  }, [])

  // FetchingPostCode
  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const { data, error } = await supabase.from('post_code').select('*').ilike('state', `${inputStateValue}`) // Use inputValue1 in the LIKE query
        if (error) throw error
        setGridData2(data)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData2()
  }, [inputStateValue])

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
    const maxPage = Math.ceil(totalRowsAddress / pageSize) - 1
    if (page < maxPage) {
      setPage(prevPage => prevPage + 1)
    }
  }

  const handleRowClick = params => {
    setSelectedData(params.row)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Card>
          <CardHeader title='Kick start your project 🚀'></CardHeader>
          <CardContent>
            <Box className='demo-space-x'>
              <Grid>
                {/* Search Address */}
                <TextField
                  fullWidth
                  label='Address'
                  value={inputValue1}
                  onChange={handleInputChange1}
                  onClick={openDialog1}
                />
              </Grid>
              <Grid>
                {/* Search Postcode */}
                <TextField
                  fullWidth
                  label='Postal Code'
                  value={inputValue2}
                  onChange={handleInputChange2}
                  onClick={openDialog2}
                />
              </Grid>
            </Box>
            {/* Search Address */}
            <Dialog open={isDialogOpen1} onClose={closeDialog1} maxWidth='lg' fullWidth>
              <DialogTitle>Search Postcode with Address</DialogTitle>
              <DialogContent>
                <Box sx={{ height: 525 }}>
                  <DataGrid
                    rows={gridData1}
                    columns={[
                      { flex: 0.06, minWidth: 80, field: 'full_address', headerName: 'Full Address' },
                      { flex: 0.06, minWidth: 80, field: 'country', headerName: 'Country' },
                      { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State' }
                    ]}
                    density='comfortable'
                    disableRowCount={true}
                    hideFooterPagination={true}
                    disableSelectionOnClick
                    onRowClick={handleRowClick}
                    rowSelection={{
                      type: 'multiple',
                      allowDeselect: false,
                      checkboxSelection: true,
                      selectedRowIds: selectedData ? [selectedData.id] : []
                    }}
                    slots={{
                      toolbar: CustomSearch
                    }}
                    slotProps={{
                      baseButton: {
                        size: 'medium',
                        variant: 'outlined'
                      },
                      toolbar: {
                        value: searchAddressQuery,
                        clearSearch: () => handleSearchAddress(''),
                        onChange: event => handleSearchAddress(event.target.value)
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
                    <Button onClick={handleNextPage} disabled={page === Math.ceil(totalRowsAddress / pageSize) - 1}>
                      Next
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog1}>Cancel</Button>
                <Button onClick={handleDialogSubmit1} variant='contained' color='primary' autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            {/* Searh PostCode */}
            <Dialog open={isDialogOpen2} onClose={closeDialog2} maxWidth='lg' fullWidth>
              <DialogTitle>Search Postcode with Address</DialogTitle>
              <DialogContent>
                <DataGrid
                  rows={gridData2}
                  columns={[
                    { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State' },
                    { flex: 0.06, minWidth: 80, field: 'post_code', headerName: 'Post Code' },
                    { flex: 0.06, minWidth: 80, field: 'city', headerName: 'City' }
                  ]}
                  disableRowCount={true}
                  hideFooterPagination={true}
                  autoHeight
                  disableSelectionOnClick
                  onRowClick={handleRowClick}
                  rowSelection={{
                    type: 'single',
                    allowDeselect: false,
                    checkboxSelection: false,
                    selectedRowIds: selectedData ? [selectedData.id] : []
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog2}>Cancel</Button>
                <Button onClick={handleDialogSubmit2} variant='contained' color='primary' autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader title='ACL and JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main security features of our template and are
              implemented in the starter-kit as well.
            </Typography>
            <Typography>Please read our Authentication and ACL Documentations to get more out of them.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Popup
