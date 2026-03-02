import React, { useEffect, useState, useCallback } from "react"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ReactPaginate from "react-paginate"
import { CSVLink } from "react-csv"
import Select from "react-select"
import { URLS } from "../../Url"
import axios from "axios"
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Label,
  FormGroup,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"

const LeavesManagement = () => {
  // Auth
  const GetAuth = localStorage.getItem("authUser")
  const TokenJson = JSON.parse(GetAuth)
  const token = TokenJson?.token
  const userDetails = TokenJson?.user
  const Roles = TokenJson?.rolesAndPermission?.[0] ?? { accessAll: true }

  // State Management
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [detailsModal, setDetailsModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("pending")

  // Reject Modal State
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [leaveToReject, setLeaveToReject] = useState(null)

  // Pagination
  const [listPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)

  // Filters
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    institution: "",
  })

  // Select Styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 38,
      fontSize: 14,
      borderRadius: 6,
      borderColor: state.isFocused ? "#2563eb" : "#d0d7e2",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      "&:hover": {
        borderColor: "#b8c2d3",
      },
    }),
    menu: base => ({
      ...base,
      zIndex: 9999,
      maxHeight: "300px",
    }),
    menuList: base => ({
      ...base,
      maxHeight: "250px",
      overflowY: "auto",
    }),
    option: base => ({
      ...base,
      fontSize: 14,
      padding: "8px 12px",
    }),
  }

  // Fetch Leaves Data
  const fetchLeaves = useCallback(async () => {
    if (!token) {
      toast.error("Authentication token not found")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        URLS.GetAllLeaves,
        { status: statusFilter },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data?.success && response.data?.leaves) {
        setLeaves(response.data.leaves)
        setFilteredLeaves(response.data.leaves)
      } else {
        toast.error("No leaves data found")
      }
    } catch (error) {
      console.error("Error fetching leaves:", error)
      toast.error(error.response?.data?.message || "Failed to fetch leaves data")
    } finally {
      setIsLoading(false)
    }
  }, [token, statusFilter])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  // Search Functionality
  const handleSearch = e => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    setPageNumber(0)

    const filtered = leaves.filter(
      leave =>
        leave.placeofworkingName?.toLowerCase().includes(value) ||
        leave.institutionName?.toLowerCase().includes(value) ||
        leave.subject?.toLowerCase().includes(value) ||
        leave.description?.toLowerCase().includes(value) ||
        leave.appliedBy?.toLowerCase().includes(value) ||
        (leave.status === 'approved' && leave.approvedByName?.toLowerCase().includes(value))
    )
    setFilteredLeaves(filtered)
  }

  // Handle Tab Changes
  const handleTabChange = (status) => {
    setStatusFilter(status)
    setPageNumber(0)
    setSearchTerm("")
    setFilters({
      fromDate: "",
      toDate: "",
      institution: "",
    })
  }

  // Filter Functionality
  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = () => {
    let filtered = [...leaves]

    if (filters.fromDate) {
      filtered = filtered.filter(
        leave => new Date(leave.fromDate) >= new Date(filters.fromDate)
      )
    }

    if (filters.toDate) {
      filtered = filtered.filter(
        leave => new Date(leave.toDate) <= new Date(filters.toDate)
      )
    }

    if (filters.institution) {
      filtered = filtered.filter(leave =>
        leave.institutionName?.toLowerCase().includes(filters.institution.toLowerCase()) ||
        leave.placeofworkingName?.toLowerCase().includes(filters.institution.toLowerCase())
      )
    }

    setFilteredLeaves(filtered)
    setPageNumber(0)
  }

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      institution: "",
    })
    setFilteredLeaves(leaves)
    setSearchTerm("")
    setPageNumber(0)
  }

  // Pagination
  // Ensure pageNumber is valid if the list shrinks
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredLeaves.length / listPerPage) - 1)
    if (pageNumber > maxPage) {
      setPageNumber(maxPage)
    }
  }, [filteredLeaves.length, listPerPage, pageNumber])

  const pagesVisited = pageNumber * listPerPage
  const lists = filteredLeaves.slice(pagesVisited, pagesVisited + listPerPage)
  const pageCount = Math.ceil(filteredLeaves.length / listPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  // Actions
  const handleUpdateStatus = async (id, newStatus, reason = "") => {
    try {
      const payload = { status: newStatus }
      if (newStatus === "rejected" && reason) {
        payload.rejectedReason = reason
      }

      const response = await axios.put(
        URLS.UpdateLeaveStatus + id,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data?.success) {
        fetchLeaves()
        if (newStatus === "rejected") {
          toggleRejectModal()
        }
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error(error.response?.data?.message || "Failed to update status")
    }
  }

  const handleRejectClick = (leaveId) => {
    setLeaveToReject(leaveId)
    setRejectReason("")
    setRejectModal(true)
  }

  const toggleRejectModal = () => {
    setRejectModal(!rejectModal)
    if (rejectModal) {
      setLeaveToReject(null)
      setRejectReason("")
    }
  }

  const submitReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection")
      return
    }
    handleUpdateStatus(leaveToReject, "rejected", rejectReason)
  }

  // View Details
  const viewLeaveDetails = async (leaveId) => {
    try {
      const response = await axios.post(
        URLS.GetLeaveRequestById,
        { id: leaveId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data?.success && response.data?.leave) {
        setSelectedLeave(response.data.leave)
        setDetailsModal(true)
      } else {
        toast.error("Failed to fetch leave details")
      }
    } catch (error) {
      console.error("Error fetching leave details:", error)
      toast.error(error.response?.data?.message || "Failed to fetch leave details")
    }
  }

  const toggleDetailsModal = () => {
    setDetailsModal(!detailsModal)
    if (detailsModal) {
      setSelectedLeave(null)
    }
  }

  // Format Date
  const formatDate = dateString => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Format Date with Time
  const formatDateTime = dateString => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Calculate Leave Duration
  const calculateDuration = (from, to) => {
    if (!from || !to) return "N/A"
    const fromDate = new Date(from)
    const toDate = new Date(to)
    const diffTime = Math.abs(toDate - fromDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} ${diffDays === 1 ? "Day" : "Days"}`
  }

  // CSV Export Data
  const csvData = filteredLeaves.map((leave, index) => {
    const data = {
      "S.No": index + 1,
      "Applied By": leave.appliedBy || "N/A",
      "Place of Working": leave.placeofworkingName || "N/A",
      "Institution Name": leave.institutionName || "N/A",
      "Leave From": formatDate(leave.fromDate),
      "Leave To": formatDate(leave.toDate),
      Duration: calculateDuration(leave.fromDate, leave.toDate),
      "Leave Reason": leave.leaveReasonName || "N/A",
      Subject: leave.subject || "N/A",
      Description: leave.description || "N/A",
      "Applied Date": formatDateTime(leave.logCreatedDate),
      Status: leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : "Pending",
    }
    if (statusFilter === "approved" || statusFilter === "pending") {
      data["Approved By"] = leave.status === 'approved' ? (leave.approvedByName || "N/A") : "N/A"
    }
    if (statusFilter === "rejected") {
      data["Rejected By"] = leave.status === 'rejected' ? (leave.rejectedByName || "N/A") : "N/A"
      data["Rejected Reason"] = leave.status === 'rejected' ? (leave.rejectedReason || "N/A") : "N/A"
    }
    return data
  })

  const csvReport = {
    filename: `Leaves_Report_${new Date().toISOString().split("T")[0]}.csv`,
    data: csvData,
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="VAHD ADMIN" breadcrumbItem="Leaves Management" />

          {Roles?.LeavesManagement === true || Roles?.accessAll === true ? (
            <>
              {/* Main Card */}
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      {/* Header Section */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="card-title mb-0">
                            <i className="bx bx-calendar-event me-2 text-primary"></i>
                            Leave Applications
                          </h5>
                          <p className="text-muted mb-0 mt-1">
                            Total Records: <strong>{filteredLeaves.length}</strong>
                          </p>
                        </div>
                        <div className="d-flex gap-2">
                          {/* <Button
                            color="info"
                            size="sm"
                            outline
                            onClick={() => setShowFilters(!showFilters)}
                          >
                            <i className={`bx ${showFilters ? "bx-x" : "bx-filter"} me-1`}></i>
                            {showFilters ? "Hide" : "Show"} Filters
                          </Button>
                          <Button
                            color="success"
                            size="sm"
                            outline
                            onClick={fetchLeaves}
                            disabled={isLoading}
                          >
                            <i className="bx bx-refresh me-1"></i>
                            Refresh
                          </Button>
                          {filteredLeaves.length > 0 && (
                            <CSVLink {...csvReport}>
                              <Button color="success" size="sm" outline>
                                <i className="bx bx-download me-1"></i>
                                Export CSV
                              </Button>
                            </CSVLink>
                          )} */}
                        </div>
                      </div>

                      {/* Filter Section */}
                      {showFilters && (
                        <Card className="border mb-4 bg-light">
                          <CardBody>
                            <h6 className="mb-3 text-primary">
                              <i className="bx bx-filter-alt me-2"></i>
                              Filter Options
                            </h6>
                            <Row>
                              <Col md={4}>
                                <FormGroup>
                                  <Label>From Date</Label>
                                  <Input
                                    type="date"
                                    name="fromDate"
                                    value={filters.fromDate}
                                    onChange={handleFilterChange}
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label>To Date</Label>
                                  <Input
                                    type="date"
                                    name="toDate"
                                    value={filters.toDate}
                                    onChange={handleFilterChange}
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label>Institution / Place of Working</Label>
                                  <Input
                                    type="text"
                                    name="institution"
                                    value={filters.institution}
                                    onChange={handleFilterChange}
                                    placeholder="Search Institution or Place"
                                    className="form-control"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <div className="d-flex gap-2 mt-2">
                              <Button color="primary" size="sm" onClick={applyFilters}>
                                <i className="bx bx-check me-1"></i>
                                Apply Filters
                              </Button>
                              <Button color="secondary" size="sm" outline onClick={resetFilters}>
                                <i className="bx bx-reset me-1"></i>
                                Reset
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      )}

                      {/* Tabs & Search */}
                      <Row className="mb-3 align-items-center">
                        <Col md={8}>
                          <Nav pills className="navtab-bg nav-justified">
                            <NavItem>
                              <NavLink
                                className={`cursor-pointer ${statusFilter === "pending" ? "active" : ""}`}
                                onClick={() => handleTabChange("pending")}
                                style={{ cursor: "pointer" }}
                              >
                                Pending
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={`cursor-pointer ${statusFilter === "approved" ? "active" : ""}`}
                                onClick={() => handleTabChange("approved")}
                                style={{ cursor: "pointer" }}
                              >
                                Approved
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={`cursor-pointer ${statusFilter === "rejected" ? "active" : ""}`}
                                onClick={() => handleTabChange("rejected")}
                                style={{ cursor: "pointer" }}
                              >
                                Rejected
                              </NavLink>
                            </NavItem>
                          </Nav>
                        </Col>
                        {/* <Col md={4} className="mt-3 mt-md-0">
                          <div className="search-box">
                            <div className="position-relative">
                              <Input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                              />
                              <i className="bx bx-search-alt search-icon"></i>
                            </div>
                          </div>
                        </Col> */}
                      </Row>

                      {/* Table Section */}
                      {isLoading ? (
                        <div className="text-center py-5">
                          <Spinner color="primary" />
                          <p className="mt-2 text-muted">Loading leaves data...</p>
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <Table className="table table-hover table-bordered align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th className="text-center" style={{ width: "50px" }}>
                                    S.No
                                  </th>
                                  <th>Applied By</th>
                                  <th>Institution</th>
                                  <th>Place of Working</th>
                                  <th className="text-center">Leave From</th>
                                  <th className="text-center">Leave To</th>
                                  <th className="text-center">Duration</th>
                                  <th>Leave Reason</th>
                                  <th>Subject</th>
                                  <th className="text-center">Applied Date</th>
                                  <th className="text-center">Status</th>
                                  {statusFilter === 'approved' && <th>Approved By</th>}
                                  {statusFilter === 'rejected' && (
                                    <>
                                      <th>Rejected By</th>
                                      <th>Rejected Reason</th>
                                    </>
                                  )}
                                  <th className="text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lists.length > 0 ? (
                                  lists.map((leave, index) => (
                                    <tr key={leave._id || index}>
                                      <td className="text-center fw-bold">
                                        {pagesVisited + index + 1}
                                      </td>
                                      <td>
                                        <div className="fw-bold text-dark">
                                          {leave.appliedBy || "N/A"}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="fw-bold text-dark">
                                          {leave.institutionName || "N/A"}
                                        </div>
                                      </td>
                                      <td>{leave.placeofworkingName || "N/A"}</td>
                                      <td className="text-center">
                                        {formatDate(leave.fromDate)}
                                      </td>
                                      <td className="text-center">
                                        {formatDate(leave.toDate)}
                                      </td>
                                      <td className="text-center">
                                        <Badge color="info" pill>
                                          {calculateDuration(leave.fromDate, leave.toDate)}
                                        </Badge>
                                      </td>
                                      <td>
                                        <div className="text-truncate text-secondary fw-semibold">
                                          {leave.leaveReasonName || "N/A"}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-truncate" style={{ maxWidth: "250px" }}>
                                          {leave.subject || "N/A"}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        {formatDate(leave.logCreatedDate)}
                                      </td>
                                      <td className="text-center">
                                        <Badge
                                          color={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : leave.status === 'pending' ? 'warning' : 'secondary'}
                                          pill
                                        >
                                          {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : "Pending"}
                                        </Badge>
                                      </td>
                                      {statusFilter === 'approved' && (
                                        <td>
                                          <div className="fw-bold text-dark">
                                            {leave.approvedByName || "N/A"}
                                          </div>
                                        </td>
                                      )}
                                      {statusFilter === 'rejected' && (
                                        <>
                                          <td>
                                            <div className="fw-bold text-dark">
                                              {leave.rejectedByName || "N/A"}
                                            </div>
                                          </td>
                                          <td>
                                            <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                              {leave.rejectedReason || "N/A"}
                                            </div>
                                          </td>
                                        </>
                                      )}
                                      <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                          <Button
                                            color="primary"
                                            size="sm"
                                            outline
                                            onClick={() => viewLeaveDetails(leave._id)}
                                            title="View Details"
                                          >
                                            <i className="bx bx-show"></i>
                                          </Button>
                                          {(!leave.status || leave.status === "pending") && (
                                            <>
                                              <Button
                                                color="success"
                                                size="sm"
                                                outline
                                                onClick={() => handleUpdateStatus(leave._id, "approved")}
                                                title="Approve"
                                              >
                                                <i className="bx bx-check"></i>
                                              </Button>
                                              <Button
                                                color="danger"
                                                size="sm"
                                                outline
                                                onClick={() => handleRejectClick(leave._id)}
                                                title="Reject"
                                              >
                                                <i className="bx bx-x"></i>
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="13" className="text-center py-4">
                                      <div className="text-muted">
                                        <i className="bx bx-info-circle me-2"></i>
                                        No leave applications found
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>

                          {/* Pagination */}
                          {pageCount > 1 && (
                            <Row className="mt-4">
                              <Col>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="text-muted">
                                    Showing {pagesVisited + 1} to{" "}
                                    {Math.min(pagesVisited + listPerPage, filteredLeaves.length)} of{" "}
                                    {filteredLeaves.length} entries
                                  </div>
                                  <ReactPaginate
                                    previousLabel={<i className="bx bx-chevron-left"></i>}
                                    nextLabel={<i className="bx bx-chevron-right"></i>}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName="pagination pagination-sm mb-0"
                                    activeClassName="active"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    forcePage={pageNumber}
                                  />
                                </div>
                              </Col>
                            </Row>
                          )}
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* View Details Modal */}
              <Modal isOpen={detailsModal} toggle={toggleDetailsModal} size="lg">
                <ModalHeader toggle={toggleDetailsModal} className=" text-black">
                  <i className="bx bx-calendar-event me-2"></i>
                  Leave Application Details
                </ModalHeader>
                <ModalBody>
                  {selectedLeave && (
                    <div>
                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Applied By</Label>
                            <h6 className="mb-0">{selectedLeave.appliedBy || "N/A"}</h6>
                          </div>
                        </Col>
                        {selectedLeave.status === 'approved' && (
                          <Col md={6}>
                            <div className="border-bottom pb-2 mb-3">
                              <Label className="text-muted mb-1">Approved By</Label>
                              <h6 className="mb-0">{selectedLeave.approvedByName || "N/A"}</h6>
                            </div>
                          </Col>
                        )}
                        {selectedLeave.status === 'rejected' && (
                          <Col md={6}>
                            <div className="border-bottom pb-2 mb-3">
                              <Label className="text-muted mb-1">Rejected By</Label>
                              <h6 className="mb-0">{selectedLeave.rejectedByName || "N/A"}</h6>
                            </div>
                          </Col>
                        )}
                      </Row>

                      {selectedLeave.status === 'rejected' && selectedLeave.rejectedReason && (
                        <Row className="mb-3">
                          <Col md={12}>
                            <div className="border-bottom pb-2 mb-3">
                              <Label className="text-muted mb-1">Rejected Reason</Label>
                              <h6 className="mb-0 text-danger">{selectedLeave.rejectedReason}</h6>
                            </div>
                          </Col>
                        </Row>
                      )}

                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Institution Name</Label>
                            <h6 className="mb-0">{selectedLeave.institutionName || "N/A"}</h6>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Place of Working</Label>
                            <h6 className="mb-0">{selectedLeave.placeofworkingName || "N/A"}</h6>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={4}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Leave From</Label>
                            <h6 className="mb-0 text-primary">
                              {formatDate(selectedLeave.fromDate)}
                            </h6>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Leave To</Label>
                            <h6 className="mb-0 text-primary">
                              {formatDate(selectedLeave.toDate)}
                            </h6>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Duration</Label>
                            <h6 className="mb-0">
                              <Badge color="info" className="px-3 py-2">
                                {calculateDuration(selectedLeave.fromDate, selectedLeave.toDate)}
                              </Badge>
                            </h6>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Applied Date</Label>
                            <h6 className="mb-0">{formatDateTime(selectedLeave.logCreatedDate)}</h6>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Last Modified</Label>
                            <h6 className="mb-0">{formatDateTime(selectedLeave.logModifiedDate)}</h6>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={12}>
                          <div className="border-bottom pb-2 mb-3">
                            <Label className="text-muted mb-1">Subject</Label>
                            <h6 className="mb-0">{selectedLeave.subject || "N/A"}</h6>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <div className="pb-2">
                            <Label className="text-muted mb-1">Description</Label>
                            <div className="bg-light p-3 rounded">
                              <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                                {selectedLeave.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleDetailsModal}>
                    <i className="bx bx-x me-1"></i>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>

              {/* Reject Reason Modal */}
              <Modal isOpen={rejectModal} toggle={toggleRejectModal}>
                <ModalHeader toggle={toggleRejectModal} className="text-black">
                  <i className="bx bx-x-circle me-2 text-danger"></i>
                  Reject Leave Application
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label className="fw-bold">Reason for Rejection <span className="text-danger">*</span></Label>
                    <Input
                      type="textarea"
                      rows="4"
                      placeholder="Enter the reason why this leave is being rejected..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="form-control"
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleRejectModal}>
                    Cancel
                  </Button>
                  <Button color="danger" onClick={submitReject}>
                    Reject Leave
                  </Button>
                </ModalFooter>
              </Modal>
            </>
          ) : (
            <Card>
              <CardBody className="text-center py-5">
                <i className="bx bx-error-circle text-danger display-4 mb-3"></i>
                <h4>Access Denied</h4>
                <p className="text-muted">
                  You do not have permission to view this page. Please contact your administrator.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </React.Fragment>
  )
}

export default LeavesManagement
