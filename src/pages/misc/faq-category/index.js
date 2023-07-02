// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar, GridApi } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import CustomTextField from 'src/@core/components/mui/text-field'
import Box from '@mui/material/Box'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

import { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
import { useRouter } from 'next/router'

const FAQCategory = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [newRow, setNewRow] = useState({})

  const columns = [
    {
      field: "id",
      headerName: "ID",
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row.id) + 1,
    },
    {
      flex: 0.12,
      minWidth: 10,
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

  const pageSizeOptions = [7, 10, 25, 50, 100]

  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')

  const fetchRows = async () => {
    const { data, error, count } = await supabase
      .from('faq_categories')
      .select('*', { count: 'exact' })
      .ilike('name', `%${searchText}%`)
      .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

    if (error) {
      console.error(error)
    } else {
      setRows(data)
      setTotalCount(count)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [currentPage, pageSize, searchText])

  const handlePageChange = params => {
    setCurrentPage(params.page)
    setPageSize(params.pageSize)
    console.log(params)
    console.log(params.pageSize)
  }

  const handleSearch = event => {
    setSearchText(event.target.value)
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
    const { data, error } = await supabase.from('faq_categories').insert(newRow)
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
    const { data, error } = await supabase
      .from('faq_categories')
      .update({
        icon: selectedRow.icon,
        name: selectedRow.name,
        description: selectedRow.description
      })
      .match({ id: selectedRow.id })
    if (!error) {
      toast.success('FAQs categories updated successfully')
      setOpenEditDialog(false)
      fetchRows()
    } else {
      toast.error('Failed to updated categories')
    }
  }

  const handleDeleteSubmit = async () => {
    const { error } = await supabase.from('faq_categories').delete().match({ id: selectedRow })
    if (!error) {
      toast.success('FAQs categories deleted successfully')
      setOpenDeleteDialog(false)
      fetchRows()
    } else {
      toast.error('Failed to faqs categories')
    }
  }

  // End Function CRUD
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
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          pagination
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={handlePageChange}
          pageSizeOptions={pageSizeOptions}
          components={{
            Toolbar: GridToolbar
          }}
          onSearchChange={handleSearch}
        />
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
