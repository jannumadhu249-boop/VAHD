import React, { useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import "react-datepicker/dist/react-datepicker.css"
import ReactPaginate from "react-paginate"
import DatePicker from "react-datepicker"
import { URLS } from "../../Url"
import axios from "axios"

const FinancialYear = () => {
  // State for data management
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // State for modals
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  // State for forms
  const [addFormData, setAddFormData] = useState({
    year: "",
    startDate: null,
    endDate: null,
  })

  const [editFormData, setEditFormData] = useState({
    id: "",
    year: "",
    startDate: null,
    endDate: null,
  })

  // State for pagination
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  // Get authentication token
  const getAuthToken = () => {
    const authUser = localStorage.getItem("authUser")
    if (authUser) {
      const tokenJson = JSON.parse(authUser)
      return tokenJson.token
    }
    return null
  }

  // Fetch financial years on component mount
  useEffect(() => {
    fetchFinancialYears()
  }, [])

  // Fetch all financial years
  const fetchFinancialYears = async () => {
    const token = getAuthToken()
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    try {
      const response = await axios.post(
        URLS.GetFinancialyear,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (response.status === 200) {
        setData(response.data.data)
        setFilteredData(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching financial years:", error)
      toast.error(error.response?.data?.message || "Failed to fetch data")
    }
  }

  // Handle input changes for add form
  const handleAddInputChange = e => {
    const { name, value } = e.target
    setAddFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle input changes for edit form
  const handleEditInputChange = e => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle date changes for add form
  const handleAddDateChange = (date, field) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: date,
    }))
  }

  // Handle date changes for edit form
  const handleEditDateChange = (date, field) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: date,
    }))
  }

  // Reset add form
  const resetAddForm = () => {
    setAddFormData({
      year: "",
      startDate: null,
      endDate: null,
    })
    setAddModal(false)
  }

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      id: "",
      year: "",
      startDate: null,
      endDate: null,
    })
    setEditModal(false)
  }

  // Validate form data
  const validateFormData = formData => {
    if (!formData.year.trim()) {
      toast.error("Please enter financial year")
      return false
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates")
      return false
    }

    if (formData.startDate >= formData.endDate) {
      toast.error("End date must be after start date")
      return false
    }

    // Validate year format (YYYY-YYYY)
    const yearPattern = /^\d{4}-\d{4}$/
    if (!yearPattern.test(formData.year)) {
      toast.error("Please enter valid year format (YYYY-YYYY)")
      return false
    }

    return true
  }

  // Handle add form submission
  const handleAddSubmit = async e => {
    e.preventDefault()

    if (!validateFormData(addFormData)) return

    const token = getAuthToken()
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    const payload = {
      year: addFormData.year,
      startDate: addFormData.startDate.toISOString().split("T")[0],
      endDate: addFormData.endDate.toISOString().split("T")[0],
    }

    try {
      const response = await axios.post(URLS.AddFinancialyear, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success(
          response.data.message || "Financial year added successfully"
        )
        resetAddForm()
        fetchFinancialYears()
      }
    } catch (error) {
      console.error("Error adding financial year:", error)
      toast.error(error.response?.data?.message || "Failed to add data")
    }
  }

  // Handle edit form submission
  const handleEditSubmit = async e => {
    e.preventDefault()

    if (!validateFormData(editFormData)) return

    const token = getAuthToken()
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    const payload = {
      year: editFormData.year,
      startDate: editFormData.startDate.toISOString().split("T")[0],
      endDate: editFormData.endDate.toISOString().split("T")[0],
    }

    try {
      const response = await axios.post(
        `${URLS.EditFinancialyear}${editFormData.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(
          response.data.message || "Financial year updated successfully"
        )
        resetEditForm()
        fetchFinancialYears()
      }
    } catch (error) {
      console.error("Error updating financial year:", error)
      toast.error(error.response?.data?.message || "Failed to update data")
    }
  }

  // Handle edit button click
  const handleEdit = financialYear => {
    setEditFormData({
      id: financialYear._id,
      year: financialYear.year,
      startDate: financialYear.startDate
        ? new Date(financialYear.startDate)
        : null,
      endDate: financialYear.endDate ? new Date(financialYear.endDate) : null,
    })
    setEditModal(true)
  }

  // Handle delete button click
  const handleDelete = async financialYear => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${financialYear.year}"?`
    )

    if (!confirmDelete) return

    const token = getAuthToken()
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    try {
      const response = await axios.post(
        `${URLS.DeleteFinancialyear}${financialYear._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 200) {
        toast.success(
          response.data.message || "Financial year deleted successfully"
        )
        fetchFinancialYears()
      }
    } catch (error) {
      console.error("Error deleting financial year:", error)
      toast.error(error.response?.data?.message || "Failed to delete data")
    }
  }

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data)
      setPageNumber(0)
    } else {
      const filtered = data.filter(item =>
        item.year.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredData(filtered)
      setPageNumber(0)
    }
  }, [searchTerm, data])

  // Pagination calculations
  const pagesVisited = pageNumber * listPerPage
  const currentItems = filteredData.slice(
    pagesVisited,
    pagesVisited + listPerPage
  )
  const pageCount = Math.ceil(filteredData.length / listPerPage)

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected)
  }

  var gets = localStorage.getItem("authUser")
  var datas = JSON.parse(gets)
  var Roles = datas?.rolesAndPermission?.[0] ?? { accessAll: true }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Financial Year" />

          {/* Add Financial Year Modal */}
          <Modal isOpen={addModal} toggle={resetAddForm} size="lg">
            <ModalHeader toggle={resetAddForm}>Add Financial Year</ModalHeader>
            <Form onSubmit={handleAddSubmit}>
              <ModalBody>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label>
                        Financial Year <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="year"
                        value={addFormData.year}
                        onChange={handleAddInputChange}
                        placeholder="e.g., 2024-2025"
                        required
                      />
                      <small className="form-text text-muted">
                        Format: YYYY-YYYY
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Start Date <span className="text-danger">*</span>
                      </Label>
                      <DatePicker
                        selected={addFormData.startDate}
                        onChange={date =>
                          handleAddDateChange(date, "startDate")
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Select start date"
                        isClearable
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        End Date <span className="text-danger">*</span>
                      </Label>
                      <DatePicker
                        selected={addFormData.endDate}
                        onChange={date => handleAddDateChange(date, "endDate")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Select end date"
                        isClearable
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="secondary" onClick={resetAddForm}>
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add Financial Year
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          {/* Edit Financial Year Modal */}
          <Modal isOpen={editModal} toggle={resetEditForm} size="lg">
            <ModalHeader toggle={resetEditForm}>
              Edit Financial Year
            </ModalHeader>
            <Form onSubmit={handleEditSubmit}>
              <ModalBody>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label>
                        Financial Year <span className="text-danger">*</span>
                      </Label>
                      <Input
                        type="text"
                        name="year"
                        value={editFormData.year}
                        onChange={handleEditInputChange}
                        placeholder="e.g., 2024-2025"
                        required
                      />
                      <small className="form-text text-muted">
                        Format: YYYY-YYYY
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Start Date <span className="text-danger">*</span>
                      </Label>
                      <DatePicker
                        selected={editFormData.startDate}
                        onChange={date =>
                          handleEditDateChange(date, "startDate")
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Select start date"
                        isClearable
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        End Date <span className="text-danger">*</span>
                      </Label>
                      <DatePicker
                        selected={editFormData.endDate}
                        onChange={date => handleEditDateChange(date, "endDate")}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Select end date"
                        isClearable
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="secondary" onClick={resetEditForm}>
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Update Financial Year
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          {/* Main Content */}
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Financial Years List</h5>
                    <div className="d-flex gap-2">
                      <Input
                        type="text"
                        placeholder="Search by year..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />

                      {Roles?.FinancialYearAdd === true ||
                      Roles?.accessAll === true ? (
                        <>
                          <Button
                            color="primary"
                            onClick={() => setAddModal(true)}
                          >
                            <i className="bx bx-plus me-1"></i> Add New
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="table-responsive">
                    <Table hover bordered className="mb-0">
                      <thead className="table-light">
                        <tr className="text-center">
                          <th width="50">#</th>
                          <th>Financial Year</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((item, index) => {
                            const serialNumber = pagesVisited + index + 1
                            return (
                              <tr key={item._id} className="text-center">
                                <td>{serialNumber}</td>
                                <td>
                                  <strong>{item.year}</strong>
                                </td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2">
                                    {Roles?.FinancialYearEdit === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          color="info"
                                          size="sm"
                                          onClick={() => handleEdit(item)}
                                          title="Edit"
                                        >
                                          <i className="bx bx-edit"></i>
                                        </Button>
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {Roles?.FinancialYearDelete === true ||
                                    Roles?.accessAll === true ? (
                                      <>
                                        <Button
                                          color="danger"
                                          size="sm"
                                          onClick={() => handleDelete(item)}
                                          title="Delete"
                                        >
                                          <i className="bx bx-trash"></i>
                                        </Button>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              {searchTerm
                                ? "No matching records found"
                                : "No financial years available"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {filteredData.length > listPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                      <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        containerClassName={
                          "pagination pagination-rounded mb-0"
                        }
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                        disabledClassName={"disabled"}
                        forcePage={pageNumber}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default FinancialYear
