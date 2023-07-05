import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
import toast from 'react-hot-toast'
// ** MUI Imports
import { DataGrid, gridColumnGroupsLookupSelector } from '@mui/x-data-grid'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardHeader,
  Box,
  MenuItem,
  Typography
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomSearch from 'src/views/table/CustomSearch'
import CustomAvatar from 'src/@core/components/mui/avatar'

const pageSizeOptions = [5, 10, 25, 50, 100] // Available rows per page options
const initialPageSize = pageSizeOptions[0] // Initial rows per page

const FAQCategory = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [newRow, setNewRow] = useState({})
  const [page, setPage] = useState(0) // Current page number
  const [totalRows, setTotalRows] = useState(0) // Total number of rows
  const [rows, setRows] = useState([]) // Rows to be displayed
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(initialPageSize) // Rows per page
  const [filteredData, setFilteredData] = useState([])

  const fetchRows = async () => {
    const offset = page * pageSize

    try {
      const { data } = await supabase.rpc('get_faq_categories', {
        p_offset: offset,
        p_limit: pageSize,
        p_search_text: searchQuery
      })

      setRows(data[0].data)
      setTotalRows(data[0].row_count)
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const handleSearch = searchValue => {
    setSearchQuery(searchValue)
  }

  // Function CRUD
  const handleAddOpen = () => {
    setOpenAddDialog(true)
  }

  const handleAddClose = () => {
    setOpenAddDialog(false)
  }

  const handleInputChange = e => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value })
  }

  const handleInsert = async () => {
    const { data, error } = await supabase.rpc('create_faq_categories', {
      new_icon: newRow.icon,
      new_name: newRow.name,
      new_description: newRow.description,
    })
    if (!error) {
      setOpenAddDialog(false)
      setNewRow({})
      toast.success('FAQs categories add successfully')
      fetchRows()
    } else {
      toast.error('Failed to add faqs categories')
    }
  }

  const handleEdit = async id => {
    setSelectedRow(id)
    setOpenEditDialog(true)
  }

  const handleDelete = async id => {
    setSelectedRow(id)
    setOpenDeleteDialog(true)
  }

  const handleEditDialogClose = () => {
    setOpenEditDialog(false)
  }

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false)
  }

  const handleEditSubmit = async () => {
    const { data, error } = await supabase.rpc('update_faq_categories_by_id', {
      by_id: selectedRow.id,
      new_icon: selectedRow.icon,
      new_name: selectedRow.name,
      new_description: selectedRow.description
    })
    if (!error) {
      toast.success('FAQs categories updated successfully')
      setOpenEditDialog(false)
      fetchRows()
    } else {
      toast.error('Failed to updated categories')
    }
  }

  const handleDeleteSubmit = async () => {
    const { error } = await supabase.rpc('delete_faq_categories_by_id', {
      by_id: selectedRow
    })
    if (!error) {
      toast.success('FAQs categories deleted successfully')
      setOpenDeleteDialog(false)
      fetchRows()
    } else {
      toast.error('Failed to faqs categories')
    }
  }
  // End Function CRUD

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      filterable: false
    },
    {
      flex: 0.12,
      minWidth: 10,
      field: 'icon',
      headerName: 'Icon',
      renderCell: params => (
        <CustomAvatar skin='light' variant='rounded'>
          <Icon icon={params.row.icon} fontSize='2.25rem' />
        </CustomAvatar>
      )
    },
    { flex: 0.18, minWidth: 120, field: 'name', headerName: 'Name' },
    { flex: 0.175, minWidth: 120, field: 'description', headerName: 'Description' },
    {
      field: '',
      headerName: 'Actions',
      width: 150,
      renderCell: params => (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            variant='tonal'
            color='primary'
            aria-label='add'
            size='small'
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 3 }}
          >
            <Icon icon='tabler:edit' />
          </Button>
          <Button
            variant='tonal'
            color='error'
            aria-label='add'
            size='small'
            onClick={() => handleDelete(params.row.id)}
          >
            <Icon icon='tabler:trash' />
          </Button>
        </Box>
      )
    }
  ]

  useEffect(() => {
    fetchRows()
  }, [page, pageSize, searchQuery])
  return (
    <>
      <Card>
        <CardHeader
          title='FAQs Categories'
          action={
            <div>
              <Button size='medium' variant='contained' onClick={handleAddOpen}>
                Add Categories
              </Button>
            </div>
          }
        />
        <Box sx={{ height: 525 }}>
          <DataGrid
            density='comfortable'
            disableRowCount={true}
            hideFooterPagination={true}
            columns={columns}
            rows={rows ?? []}
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
            <CustomTextField select defaultValue={5}>
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
      {/* Dialog Add */}
      <Dialog open={openAddDialog} onClose={handleAddClose}>
        <DialogTitle>Add Data</DialogTitle>
        <DialogContent>
          <CustomTextField
            type='text'
            label='Icon'
            name='icon'
            value={newRow.icon}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 3 }}
          />
          <CustomTextField
            type='text'
            label='Name'
            name='name'
            value={newRow.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 3 }}
          />
          <CustomTextField
            type='text'
            label='description'
            name='description'
            value={newRow.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleInsert} variant='contained' color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Edit */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Categories</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            To edit faq categories this website, please enter your data. We will send updates occasionally.
          </DialogContentText>
          <CustomTextField
            fullWidth
            type='text'
            value={selectedRow?.icon}
            onChange={e => setSelectedRow({ ...selectedRow, icon: e.target.value })}
            label='Icon'
            sx={{ mb: 3 }}
          />
          <CustomTextField
            fullWidth
            type='text'
            value={selectedRow?.name}
            onChange={e => setSelectedRow({ ...selectedRow, name: e.target.value })}
            label='Name'
            sx={{ mb: 3 }}
          />
          <CustomTextField
            fullWidth
            type='text'
            value={selectedRow?.description}
            onChange={e => setSelectedRow({ ...selectedRow, description: e.target.value })}
            label='Description'
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Delete */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default FAQCategory
