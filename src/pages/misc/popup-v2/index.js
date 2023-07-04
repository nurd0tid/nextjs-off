// ** MUI Imports
import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  Grid,
  Typography,
  CardHeader,
  CardContent,
  Box
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
const PopupV2 = () => {
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')
  const [postCode, setPostCode] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [gridData, setGridData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const handleDialogOpen = async () => {
    // Fetch data from Supabase based on country and state inputs
    const { data, error } = await supabase.rpc('search_post', {
      countries: country,
      states: state
    })

    if (error) {
      console.error('Error retrieving data:', error)
    } else {
      setGridData(data)
    }

    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleCountryChange = event => {
    // setCountry(event.target.value)
    // console.log(selectedData.map(data => data.country))
    const values = event.target.value.split(',').map(c => c.trim())
    // console.log(values)
    setCountry(values)
  }

  const handleStateChange = event => {
    const values = event.target.value.split(',').map(c => c.trim())
    // setState(event.target.value)
    setState(values)
  }

  const handleAddressChange = event => {
    setAddress(event.target.value)
  }

  const handleDialogSubmit = () => {
    const selectedData = selectedRows.map(rowId => gridData.find(row => row.id === rowId))
    setPostCode(selectedData.map(data => data.post_code).join(', '))
    handleDialogClose()
  }

    const handleRowSelection = selection => {
      setSelectedRows(selection)
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
                    onChange={handleCountryChange}
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
                    onChange={handleStateChange}
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
                    onChange={handleAddressChange}
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
                    // onChange={handlePostCodeChange}
                    onClick={handleDialogOpen}
                    sx={{
                      mb: 2
                    }}
                  />
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth='md'>
          <DialogTitle>Data Grid Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>Here is the data retrieved based on the country and state inputs.</DialogContentText>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                columns={[
                  // { flex: 0.06, minWidth: 80, field: 'country', headerName: 'Country', width: 150 },
                  // { flex: 0.06, minWidth: 80, field: 'state', headerName: 'State', width: 150 },
                  { flex: 0.06, minWidth: 80, field: 'post_code', headerName: 'Post Code', width: 150 }
                  // { flex: 0.06, minWidth: 80, field: 'city', headerName: 'City', width: 150 }
                ]}
                rows={gridData}
                autoHeight
                disableSelectionOnClick
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                selectionModel={selectedRows}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color='primary'>
              Close
            </Button>
            <Button onClick={handleDialogSubmit} color='primary'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
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
    </>
  )
}

export default PopupV2
