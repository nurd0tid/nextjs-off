import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
// ** MUI Imports
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  Grid,
  Typography,
  Box,
  CardHeader,
  CardContent,
  MenuItem
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'

const pageSizeOptions = [5, 10, 25, 50, 100] // Available rows per page options
const initialPageSize = pageSizeOptions[0] // Initial rows per pa

const PopupV1 = () => {
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')
  const [postCode, setPostCode] = useState('')
  const [isDialogOpen1, setIsDialogOpen1] = useState(false)
  const [isDialogOpen2, setIsDialogOpen2] = useState(false)
  const [isDialogOpen3, setIsDialogOpen3] = useState(false)
  const [isDialogOpen4, setIsDialogOpen4] = useState(false)
  const [gridData1, setGridData1] = useState([])
  const [gridData2, setGridData2] = useState([])
  const [gridData3, setGridData3] = useState([])
  const [gridData4, setGridData4] = useState([])
  const [selectedRows1, setSelectedRows1] = useState([])
  const [selectedRows2, setSelectedRows2] = useState([])
  const [selectedRows3, setSelectedRows3] = useState([])
  const [selectedRows4, setSelectedRows4] = useState([])

  // Pagination
  const [page, setPage] = useState(0) // Current page number
  const [pageSize, setPageSize] = useState(initialPageSize) // Rows per page
  const [totalRows, setTotalRows] = useState(0) // Total number of rows

  // Function Open Dialog

  const openDialog1 = () => {
    setIsDialogOpen1(true)
  }

  const openDialog2 = () => {
    setIsDialogOpen2(true)
  }

  const openDialog3 = () => {
    setIsDialogOpen3(true)
  }

  const openDialog4 = () => {
    setIsDialogOpen4(true)
  }

  // Function CLose Dialog

  const closeDialog1 = () => {
    setIsDialogOpen1(false)
  }

  const closeDialog2 = () => {
    setIsDialogOpen2(false)
  }

  const closeDialog3 = () => {
    setIsDialogOpen3(false)
  }

  const closeDialog4 = () => {
    setIsDialogOpen4(false)
  }

  // Handle After Checkbox Submit

  const handleDialogSubmit1 = () => {
    const selectedData = selectedRows1.map(rowId => gridData1.find(row => row.id === rowId))
    // setCountry(selectedData.map(data => data.country).join(', '))
    setCountry(selectedData.map(data => data.country))
    // console.log(selectedData.map(data => data.country))
    closeDialog1()
  }

  const handleDialogSubmit2 = () => {
    const selectedData = selectedRows2.map(rowId => gridData2.find(row => row.id === rowId))
    // setState(selectedData.map(data => data.state).join(', '))
    setState(selectedData.map(data => data.state))
    closeDialog2()
  }

  const handleDialogSubmit3 = () => {
    const selectedData = selectedRows3.map(rowId => gridData3.find(row => row.id === rowId))
    setAddress(selectedData.map(data => data.full_address).join(', '))
    closeDialog3()
  }

  const handleDialogSubmit4 = () => {
    const selectedData = selectedRows4.map(rowId => gridData4.find(row => row.id === rowId))
    setPostCode(selectedData.map(data => data.post_code).join(', '))
    closeDialog4()
  }

  // Pagination

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

  // Fetch Data

  useEffect(() => {
    const fetchData1 = async () => {
      const offset = page * pageSize
      try {
        const { data, error, count } = await supabase.rpc('get_address', {
          // filter_column: 'full_address',
          // by,
          // filter_count: '*',
          offset_value: offset,
          limit_value: offset + pageSize - 1
        })
        if (error) throw error
        setGridData1(data)
        setTotalRows(count)
        console.log('Total rows:', count)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData1()
  }, [page, pageSize])

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const { data, error } = await supabase.rpc('search_post_codes', {
          countries: country
        })
        if (error) throw error
        setGridData2(data)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData2()
  }, [country])

  useEffect(() => {
    const fetchData3 = async () => {
      try {
        const { data, error } = await supabase.rpc('search_address', {
          state_value: state
        })
        if (error) throw error
        setGridData3(data)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData3()
  }, [state])

  useEffect(() => {
    const fetchData4 = async () => {
      try {
        const { data, error } = await supabase.rpc('search_post_codes', {
          countries: country
        })
        if (error) throw error
        setGridData4(data)
      } catch (error) {
        console.log('Error fetching data from Supabase:', error.message)
      }
    }

    fetchData4()
  }, [country])

  // Selection Checkbox

  const handleRowSelection1 = selection => {
    setSelectedRows1(selection)
  }

  const handleRowSelection2 = selection => {
    setSelectedRows2(selection)
  }

  const handleRowSelection3 = selection => {
    setSelectedRows3(selection)
  }

  const handleRowSelection4 = selection => {
    setSelectedRows4(selection)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Card>
            <CardHeader title='Kick start your project 🚀'></CardHeader>
            <CardContent>
              <Box lassName='demo-space-x'>
                <Grid>
                  <TextField
                    fullWidth
                    label='Country'
                    value={country}
                    onClick={openDialog1}
                    sx={{
                      mb: 2
                    }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label='State'
                    value={state}
                    onClick={openDialog2}
                    sx={{
                      mb: 2
                    }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label='Address'
                    value={address}
                    onClick={openDialog3}
                    sx={{
                      mb: 2
                    }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label='Post Code'
                    value={postCode}
                    onClick={openDialog4}
                    sx={{
                      mb: 2
                    }}
                  />
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen1} onClose={closeDialog1} maxWidth='lg' fullWidth>
        <DialogTitle>Country List</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 525 }}>
            <DataGrid
              rows={gridData1}
              columns={[
                { flex: 0.06, minWidth: 80, field: 'country', headerName: 'Country', width: 150 }
                // { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State', width: 150 }
                // { flex: 0.06, minWidth: 80, field: 'full_address', headerName: 'Full Address', width: 200 }
              ]}
              density='comfortable'
              disableRowCount={true}
              hideFooterPagination={true}
              disableSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection1}
              selectionModel={selectedRows1}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog1}>Cancel</Button>
          <Button onClick={handleDialogSubmit1} variant='contained' color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen2} onClose={closeDialog2} maxWidth='lg' fullWidth>
        <DialogTitle>State List (Filtered by Country)</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 525 }}>
            <DataGrid
              rows={gridData2}
              columns={[
                // { flex: 0.06, minWidth: 80, field: 'country', headerName: 'Country', width: 150 },
                { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State', width: 150 }
                // { flex: 0.06, minWidth: 80, field: 'post_code', headerName: 'Post Code', width: 150 },
                // { flex: 0.06, minWidth: 80, field: 'city', headerName: 'City', width: 150 }
              ]}
              autoHeight
              disableSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection2}
              selectionModel={selectedRows2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog2}>Cancel</Button>
          <Button onClick={handleDialogSubmit2} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen3} onClose={closeDialog3} maxWidth='lg' fullWidth>
        <DialogTitle>Address List (Filtered by State)</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 525 }}>
            <DataGrid
              rows={gridData3}
              columns={[
                { flex: 0.06, minWidth: 80, field: 'full_address', headerName: 'Address', width: 150 }
                // { flex: 0.06, minWidth: 80, field: 'country', headerName: 'State', width: 150 },
                // { flex: 0.06, minWidth: 80, field: 'state', headerName: 'Post Code', width: 150 },
                // { flex: 0.06, minWidth: 80, field: 'city', headerName: 'City', width: 150 }
              ]}
              autoHeight
              disableSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection3}
              selectionModel={selectedRows3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog3}>Cancel</Button>
          <Button onClick={handleDialogSubmit3} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen4} onClose={closeDialog4} maxWidth='lg' fullWidth>
        <DialogTitle>Post Code List (Filtered by State)</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 525 }}>
            <DataGrid
              rows={gridData4}
              columns={[
                // { flex: 0.06, minWidth: 80, field: 'country', headerName: 'Country', width: 150 },
                // { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State', width: 150 },
                { flex: 0.06, minWidth: 80, field: 'post_code', headerName: 'Post Code', width: 150 }
                // { flex: 0.06, minWidth: 80, field: 'city', headerName: 'City', width: 150 }
              ]}
              autoHeight
              disableSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection4}
              selectionModel={selectedRows4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog4}>Cancel</Button>
          <Button onClick={handleDialogSubmit4} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default PopupV1
